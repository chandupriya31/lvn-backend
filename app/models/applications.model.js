import mongoose, { Schema } from "mongoose";

const ApplicationSchema = new Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    // change according to ref
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    // change according to ref
    required: true,
  },
  applicationStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },

  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Application = mongoose.model("Application", ApplicationSchema);
