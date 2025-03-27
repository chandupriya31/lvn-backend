import mongoose, { Schema } from "mongoose";

const Opportunitymodel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  numberOfVolunteers: {
    type: Number,
    required: true,
    min: 1,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },

  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Posted", "Closed", "Completed"],
    default: "Posted",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const opportunityschema = mongoose.model(
  "opportunityschema",
  Opportunitymodel
);
