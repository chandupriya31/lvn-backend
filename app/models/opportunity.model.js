import mongoose, { Schema } from "mongoose";

const opportunitySchema = new mongoose.Schema({
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
  }
,  
  numberOfVolunteers: {
    type: Number,
    required: true,
    min: 1,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    //later remove this User ..and ref it matches

    required: true,
  },

  volunteerApplications: [
    {
      volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    //later remove this User ..and ref it matches

      },
      applicationStatus: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

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

export const Opportunity = mongoose.model("Opportunity", opportunitySchema);
