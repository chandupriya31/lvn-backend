import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
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
      // Change "User" later if needed
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Completed","Working","Cancelled" ],
      default: "Open",
    },
    category:{
      type:String
    },
    skills: {
      type: [String], // ✅ Corrected syntax
    },
  },
  { timestamps: true }
);

export const Opportunity = mongoose.model("Opportunity", opportunitySchema);
