import Class from "../models/class.js";
import User from "../models/user.js";
import Poll from "../models/poll.js";


export const getUser = async (req, res) => {
    try {
        const userId = req.user.id || req.userId;

        const user = await User.findById(userId)
        .select('-password')
        if (!user){
            res.status(400).json({
                success: false,
                message: "Couldn't find user"
            })
        }

        const stdClass = await Class.findOne({className: user.className});
        const { _id, ...classData} = stdClass._doc;
        const userCombined = {...user._doc, ...classData};
        console.log("User: ", userCombined);


        res.status(200).json({
            success: true,
            user: userCombined,
            message: "User data fetched successfully"
        })


    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({message: "Error getting user data", error: error})
    }

} 



export const handleVote = async (req, res) => {
  try {
    const userId = req.user.id || req.userId;
    const { pollId, optionIndex } = req.body;
console.log("option index: ", optionIndex);
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ success: false, message: "Poll not found" });
      console.log("poll: ", poll);

    // Check if user has voted before
    let userVote = poll.userVotes.find(v => v.user.toString() === userId);

    if (!userVote) {
      // FIRST TIME VOTE
      if (!poll.options[optionIndex]) return res.status(400).json({ success: false, message: "Invalid option" });

      poll.options[optionIndex].votes += 1; // <-- update votes, not count
      poll.userVotes.push({ user: userId, option: optionIndex, changes: 0 });
      poll.voters.push(userId); // optional, if you still want a separate voters array

      await poll.save();
      return res.status(200).json({ success: true, poll, message: "Vote submitted successfully" });
    }

    // RESUBMISSION
    if (userVote.changes >= 2) return res.status(400).json({ success: false, message: "Vote change limit reached" });

    const oldOptionIndex = userVote.option;

    if (poll.options[oldOptionIndex]) poll.options[oldOptionIndex].votes -= 1; // decrement old vote
    if (!poll.options[optionIndex]) return res.status(400).json({ success: false, message: "Invalid new option" });

    poll.options[optionIndex].votes += 1; // increment new vote

    // Update user's vote
    userVote.option = optionIndex;
    userVote.changes += 1;

    await poll.save();

    res.status(200).json({ success: true, poll, message: "Vote updated successfully" });
  } catch (error) {
    console.error("Error handling vote: ", error);
    res.status(500).json({ success: false, message: `Error: ${error}` });
  }
};


export const getPeers = async (req, res) => {
  try {
    const userId = req.user.id || req.userId;

    // Fetch the logged-in user
    const currentUser = await User.findById(userId).select("-password");
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let users;
    console.log("currentusesr: ", currentUser);
    if (currentUser.role === "STUDENT_COUNCIL") {
      if (currentUser.councilPosition === "CLASS_REP") {
        // Class rep: only show their class
        users = await User.find({
          className: currentUser.className,
          _id: { $ne: currentUser._id }, // exclude self
        }).select("name className councilPosition role approvalStatus admin");
      } else {
        // Other council positions: show all users
        users = await User.find({
          _id: { $ne: currentUser._id }, // exclude self
        }).select("name className councilPosition role approvalStatus onlineStatus admin");
      }
    } else {
      // Regular students or others: no peers
      users = [];
    }

    res.status(200).json({
      success: true,
      peers: users,
      message: "Peers fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching peers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching peers",
      error,
    });
  }
};