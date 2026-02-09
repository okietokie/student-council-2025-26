// server/controllers/authControllers.js
import User from "../models/user.js";
import Class from "../models/class.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('./server/.env') });

import { sendEmail } from "./utilsEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, className, councilPosition } = req.body;

    if (!name || !email || !password || !className) {
      return res.status(400).json({ message: "Name, email, password, and class are required" });
    }

    const classExists = await Class.findOne({ className });
    if (!classExists) return res.status(400).json({ message: "Selected class does not exist" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists! Try logging in!" });

    if (role === "STUDENT_COUNCIL" && !councilPosition) {
      return res.status(400).json({ message: "Council position is required for student council members" });
    }
    if (role !== "STUDENT_COUNCIL" && councilPosition) {
      return res.status(400).json({ message: "Council position is only allowed for student council members" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      className,
      councilPosition: role === "STUDENT_COUNCIL" ? councilPosition : null,
      approvalStatus: "PENDING",
    });

    await user.save();

    // ✅ Fetch all admins
    const admins = await User.find({ admin: true }).select("email");
    const adminEmails = admins.map(a => a.email);

    // Send email to all admins
    if (adminEmails.length > 0) {
      try {
        await sendEmail({
          to: adminEmails, // array of emails
          subject: "New User Registered",
          text: `A new user has signed up:\n\nName: ${name}\nEmail: ${email}\nClass: ${className}\nRole: ${role}\nCouncil Position: ${councilPosition || "N/A"}`,
          html: `<p>A new user has signed up:</p>
                 <ul>
                   <li><b>Name:</b> ${name}</li>
                   <li><b>Email:</b> ${email}</li>
                   <li><b>Class:</b> ${className}</li>
                   <li><b>Role:</b> ${role}</li>
                   <li><b>Council Position:</b> ${councilPosition || "N/A"}</li>
                 </ul>`
        });
      } catch (err) {
        console.error("Failed to send email to admins:", err);
      }
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      approvalStatus: user.approvalStatus
    });

  } catch (error) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation failed", errors: messages });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: "Invalid credentials" 
      });
    }

    // Check approval status
    if (user.approvalStatus !== "APPROVED") {
      return res.status(403).json({ 
        message: "Your account is pending approval. Please wait for admin approval." 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: "Invalid credentials" 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        approvalStatus: user.approvalStatus
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    // Update online status
    await User.findByIdAndUpdate(
      user._id,
      { $set: { onlineStatus: "active" } }
    );

    // Get updated user without password
    const loggedInUser = await User.findById(user._id)
      .select('-password');

    res.json({ 
      success: true,
      message: "Login successful", 
      token, 
      role: user.role, 
      user: loggedInUser 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Server error during login",
      error: error.message 
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId  = req.user.id;
    const user = await User.findById(userId);

    if (user){
          await User.findByIdAndUpdate(userId, 
      {
        $set: { onlineStatus: "offline"}
      }
    );

    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.log(`error:`, err);
    res.status(500).json({ error: err.message });
  }
};