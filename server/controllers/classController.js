// server/controllers/classController.js
import Class from "../models/class.js";
import Events from "../models/events.js";
import Poll from "../models/poll.js";
import User from "../models/user.js";

export const getLatestPolls = async (req, res) => {
  try {
    const activePolls = await Poll.find({ isActive: true })
      .sort({ createdAt: -1 }) // newest first
      .limit(3)
      .select("question options createdAt updatedAt voters"); // select only fields needed

    const completedPolls = await Poll.find({ isActive: false })
      .sort({ updatedAt: -1 }) // newest completed first
      .limit(3)
      .select("question options createdAt updatedAt voters");

    // Map options to include vote counts without exposing voter IDs
    const mapPollOptions = (polls) =>
      polls.map((poll) => ({
        _id: poll._id,
        question: poll.question,
        createdAt: poll.createdAt,
        updatedAt: poll.updatedAt,
        options: poll.options.map((opt) => ({
          _id: opt._id,
          text: opt.text,
          votes: opt.votes || 0,
        })),
        totalVotes: poll.options.reduce((acc, o) => acc + (o.votes || 0), 0),
        votersCount: poll.voters?.length || 0,
      }));

    res.status(200).json({
      success: true,
      latestActivePolls: mapPollOptions(activePolls),
      latestCompletedPolls: mapPollOptions(completedPolls),
      message: "Latest polls fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching latest polls:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching polls",
      error: error.message,
    });
  }
};

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true })
      .sort({ className: 1 })
      .select('_id className academicYear department');
    
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ 
      message: "Error fetching classes",
      error: error.message 
    });
  }
};

export const getActiveStats = async (req, res) => {
  try {
    // Count all active users (students + council)
    const activeUsersCount = await User.countDocuments();

    // Count active polls
    const activePollsCount = await Poll.countDocuments({
      isActive: true,
    });
    const activeEventCount = await Events.countDocuments({status: "COMPLETED"})
    console.log("activePollsCount:", activePollsCount);

    res.status(200).json({
      success: true,
      stats: {
        activeUsers: activeUsersCount,
        activePolls: activePollsCount,
        activeEvents: activeEventCount
      },
      message: "Active stats fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching active stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching active statistics",
      error: error.message,
    });
  }
};

