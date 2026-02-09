import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["IMAGE", "VIDEO"],
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    // caption for gallery view
    caption: {
      type: String,
      trim: true,
    },

    // for ordering media
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "COMPLETED"],
      default: "UPCOMING",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    venue: {
      type: String,
      trim: true,
    },

    // Main banner / poster
    coverImage: {
      type: String,
    },

    // Multiple photos & videos
    media: [mediaSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Event", eventSchema);
