// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  avatar: {
    type: String
  },
  avatarKey: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  
  role: {
    type: String,
    enum: ['ADMIN', 'STUDENT_COUNCIL', 'FACULTY', 'STUDENT'],
    required: true,
    default: 'STUDENT'
  },
  
  councilPosition: {
    type: String,
    enum: ['CHAIRMAN', 'CHAIRPERSON', 'CLASS_REP', 'SPORTS_SECRETARY', 'ARTS_SECRETARY', null],
    default: null,
    validate: {
      validator: function(value) {
        if (this.role !== 'STUDENT_COUNCIL' && value) {
          return false;
        }
        if (this.role === 'STUDENT_COUNCIL' && !value) {
          return false;
        }
        return true;
      },
      message: 'Council position is required for STUDENT_COUNCIL role and not allowed for other roles'
    }
  },
  
  className: {
    type: String,
    required: true
  },
  
  approvalStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  admin:{
    type: Boolean,
    default: false
  },
  onlineStatus: {
    type: String,
    default: "offline"
  }
}, {
  timestamps: true
});


const User = mongoose.model('User', userSchema);

export default User;