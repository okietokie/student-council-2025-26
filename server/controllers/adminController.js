import Poll from "../models/poll.js";
import Class from "../models/class.js";
import User from "../models/user.js";

export const createPoll = async (req, res) => {
  try {
    const userId = req.user.id || req.userId;

    const { question, options, endDate } = req.body;

    // 1️⃣ Basic validation
    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Poll question and at least 2 options are required",
      });
    }

    // 2️⃣ Fetch user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Authorization check
    if (!user.admin && user.role !== "STUDENT_COUNCIL") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create polls",
      });
    }

    // 4️⃣ Fetch user's class
    const stdClass = await Class.findOne({ className: user.className });
    if (!stdClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // 5️⃣ Format MCQ options
    const formattedOptions = options.map((opt) => ({
      text: opt,
      votes: 0,
    }));

    // 6️⃣ Create poll
    const poll = await Poll.create({
      question,
      options: formattedOptions,
      createdBy: user._id,
      startDate: new Date(),
      endDate: endDate || null,
    });

    return res.status(201).json({
      success: true,
      message: "Poll created successfully",
      poll,
    });

  } catch (error) {
    console.error("Create Poll Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deletePoll = async (req, res) => {
  try {
    const userId = req.user.id || req.userId;
    const { pollId } = req.params;

    // 1️⃣ Validate pollId
    if (!pollId) {
      return res.status(400).json({
        success: false,
        message: "Poll ID is required",
      });
    }

    // 2️⃣ Fetch user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Authorization check
    if (!user.admin && user.role !== "STUDENT_COUNCIL") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete polls",
      });
    }

    // 4️⃣ Fetch poll
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    // 5️⃣ Delete poll
    await Poll.findByIdAndDelete(pollId);

    return res.status(200).json({
      success: true,
      message: "Poll deleted successfully",
    });

  } catch (error) {
    console.error("Delete Poll Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



export const editPoll = async (req, res) => {
  try {
    const userId = req.user.id || req.userId;
    const { pollId } = req.params;
    const { question, options } = req.body;
    console.log("options in edit: ", options);
    // 1️⃣ Fetch user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Authorization
    if (!user.admin && user.role !== "STUDENT_COUNCIL") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit polls",
      });
    }

    // 3️⃣ Fetch poll
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    // 4️⃣ Update question
    if (question) {
      poll.question = question;
    }

    // 5️⃣ Update options
    if (Array.isArray(options)) {
      const updatedOptions = options.map(opt => {
        if (typeof opt === 'string') {
          // frontend sent a string → convert to object
          return { text: opt, votes: 0 };
        } else if (opt._id) {
          // existing option
          const existing = poll.options.id(opt._id);
          if (existing) {
            existing.text = opt.text;
            return existing;
          }
        } else if (opt.text) {
          // new object with text
          return { text: opt.text, votes: 0 };
        }
        // skip invalid option
        return null;
      }).filter(Boolean); // remove nulls

      poll.options = updatedOptions;
    }

    poll.updatedAt = new Date();
    await poll.save();

    return res.status(200).json({
      success: true,
      message: "Poll updated successfully",
      poll,
    });

  } catch (error) {
    console.error("Edit Poll Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const finishPoll = async (req, res) => {
  try {
    const userId = req.user.id || req.userId;
    const { pollId } = req.params;

    // 1️⃣ User check
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Authorization
    if (!user.admin && user.role !== "STUDENT_COUNCIL") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to finish poll",
      });
    }

    // 3️⃣ Fetch poll
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    // 4️⃣ Already closed?
    if (!poll.isActive) {
      return res.status(400).json({
        success: false,
        message: "Poll already finished",
      });
    }

    // 5️⃣ Finish poll
    poll.isActive = false;
    poll.endedAt = new Date();

    await poll.save();

    return res.status(200).json({
      success: true,
      message: "Poll finished successfully",
      poll,
    });

  } catch (error) {
    console.error("Finish Poll Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllPolls = async (req, res) => {
  try {
    // Optional query param: ?status=active | finished
    const { status } = req.query;

    let filter = {};

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "finished") {
      filter.isActive = false;
    }

    const polls = await Poll.find(filter)
      .populate("createdBy", "name role councilPosition")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: polls.length,
      polls,
    });

  } catch (error) {
    console.error("Fetch Polls Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch polls",
    });
  }
};

export const reopenPoll = async (req, res) => {
  try {
    const userId = req.user.id || req.userId;
    const { id } = req.params; // poll ID

    if (!id) {
      return res.status(400).json({ success: false, message: "Poll ID is required" });
    }

    // Fetch user
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Authorization
    if (!user.admin && user.role !== 'STUDENT_COUNCIL') {
      return res.status(403).json({ success: false, message: "Not authorized to reopen polls" });
    }

    // Fetch poll
    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({ success: false, message: "Poll not found" });
    }

    // Reopen poll
    poll.isActive = true;
    await poll.save();

    res.status(200).json({ success: true, message: "Poll reopened successfully", poll });
  } catch (error) {
    console.error("Reopen Poll Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const approveUser = async (req, res) => {
  try {
    const approverId = req.user.id || req.userId; // from auth middleware
    const { userId } = req.params; // the user to approve

    // 1️⃣ Fetch approver
    const approver = await User.findById(approverId);
    if (!approver) {
      return res.status(404).json({ success: false, message: "Approver not found" });
    }

    // 2️⃣ Fetch the user to approve
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 3️⃣ Check if already approved
    if (user.approvalStatus === "APPROVED") {
      return res.status(400).json({ success: false, message: "User already approved" });
    }

    // 4️⃣ Approval rules
    if (approver.admin) {
      // Admin can approve anyone
      user.approvalStatus = "APPROVED";
      user.approvedBy = approver._id;
    } else if (
      approver.role === "STUDENT_COUNCIL" &&
      approver.councilPosition === "CLASS_REP" &&
      user.className === approver.className &&
      user.role !== "STUDENT_COUNCIL"
    ) {
      // Class Rep can approve students of their class only
      user.approvalStatus = "APPROVED";
      user.approvedBy = approver._id;
    } else {
      // Anyone else cannot approve
      return res.status(403).json({ 
        success: false, 
        message: "You are not authorized to approve this user" 
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${user.name} approved successfully`,
      user
    });

  } catch (error) {
    console.error("Error approving user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const rejectUserRequest = async (req, res) => {
  try {
    const userId = req.user.id || req.userId; // who is performing the action
    const { targetUserId } = req.params; // user to reject

    // Fetch the acting user
    const actor = await User.findById(userId);
    if (!actor) return res.status(404).json({ success: false, message: "Actor not found" });

    // Fetch the user to reject
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

    // Check authorization
    if (actor.admin === false) {
      // if actor is class rep, they can only reject users in their class
      if (actor.councilPosition === "CLASS_REP" && actor.className !== targetUser.className) {
        return res.status(403).json({ success: false, message: "Not authorized to reject this user" });
      }

      // any other student council member cannot reject
      if (actor.role === "STUDENT_COUNCIL" && actor.councilPosition !== "CLASS_REP") {
        return res.status(403).json({ success: false, message: "Only admin or class rep can reject" });
      }

      // regular students cannot reject
      if (actor.role !== "STUDENT_COUNCIL") {
        return res.status(403).json({ success: false, message: "You are not authorized" });
      }
    }

    // Perform rejection
    targetUser.approvalStatus = "REJECTED";
    targetUser.approvedBy = actor._id;
    await targetUser.save();

    return res.status(200).json({ success: true, message: "User request rejected", user: targetUser });

  } catch (error) {
    console.error("Reject user error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};


export const removePeer = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { userIdToRemove } = req.params;

    const admin = await User.findById(adminId);
    if (!admin || !admin.admin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can remove users",
      });
    }

    if (adminId === userIdToRemove) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove yourself",
      });
    }
    const userToRemove = await User.findById(userIdToRemove);
    if(userToRemove.councilPosition === "CHAIRMAN" || userToRemove.councilPosition === "CHAIRPERSON") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this personnel",
      });
    }
    const removedUser = await User.findByIdAndDelete(userIdToRemove);

    if (!removedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    console.error("Remove peer error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing peer",
    });
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { userId } = req.params;

    const requester = await User.findById(requesterId);
    if (
      requester.role !== "STUDENT_COUNCIL" ||
      !["CHAIRPERSON", "CHAIRMAN"].includes(requester.councilPosition)
    ) {
      return res.status(403).json({
        success: false,
        message: "Only Chairperson or Chairman can assign admin role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { admin: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User promoted to admin",
      user,
    });
  } catch (error) {
    console.error("Make admin error:", error);
    res.status(500).json({
      success: false,
      message: "Error making admin",
    });
  }
};

export const removeAsAdmin = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { userId } = req.params;

    const requester = await User.findById(requesterId);
    if (
      requester.role !== "STUDENT_COUNCIL" ||
      !["CHAIRPERSON", "CHAIRMAN"].includes(requester.councilPosition)
    ) {
      return res.status(403).json({
        success: false,
        message: "Only Chairperson or Chairman can remove admin role",
      });
    }

    if (requesterId === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own admin role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { admin: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin role removed successfully",
      user,
    });
  } catch (error) {
    console.error("Remove admin error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing admin role",
    });
  }
};
