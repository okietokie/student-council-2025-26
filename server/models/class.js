// models/Class.js
import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  academicYear: {
    type: String,
  },
  
  department: {
    type: String,
    required: true
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  totalStudents: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});


const Class = mongoose.models.Class || mongoose.model('Class', classSchema);


export default Class;