// server/controllers/classController.js
import Class from "../models/Class.js";

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