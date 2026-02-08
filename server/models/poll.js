import mongoose from 'mongoose';

const pollOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  votes: {
    type: Number,
    default: 0,
  }
});

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [pollOptionSchema],
      validate: {
        validator: function (v) {
          return v.length >= 2;
        },
        message: 'A poll must have at least 2 options',
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // admin
      required: true,
    },

    voters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
    },
    userVotes: [
      { user: mongoose.Schema.Types.ObjectId, option: Number, changes: Number }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Poll', pollSchema);
