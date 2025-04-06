import { v2 as cloudinary } from "cloudinary";
import { Opportunity } from "./../models/opportunity.model.js";
import mongoose from "mongoose";

export const getOpportunitiesByOrganization = async (req, res) => {
  try {
    console.log(req.query)
    const { rowsPerPage, page } = req.query;
    const orgId = req.id || new mongoose.Types.ObjectId("65a123456789abc123456789");
    const limit = parseInt(rowsPerPage) || 10;
    const skip = (parseInt(page) || 0) * limit;

    const organizationId = typeof orgId === 'string' 
      ? new mongoose.Types.ObjectId(orgId) 
      : orgId;

    const opportunities = await Opportunity.find({ organization: organizationId })
      .skip(skip)
      .limit(limit);

    const totalCount = await Opportunity.countDocuments({ organization: organizationId });

    const statusCounts = await Opportunity.aggregate([
      { 
        $match: { 
          organization: organizationId 
        } 
      },
      { 
        $group: { 
          _id: "$status", 
          count: { $sum: 1 } 
        } 
      }
    ]);

  

    const statusSummary = {
      Open: 0,
      Completed: 0,
      Working: 0,
      Cancelled: 0,
      totalCount
    };

    statusCounts.forEach(({ _id, count }) => {
      if (statusSummary.hasOwnProperty(_id)) {
        statusSummary[_id] = count;
      }
    });

    res.status(200).json({
      totalPages: Math.ceil(totalCount / limit),
      statusSummary,
      opportunities,
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    res.status(500).json({ 
      message: "Error fetching opportunities",
      error: error.message // Include error message for debugging
    });
  }
};


export const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      time,
      numberOfVolunteers,
      location,
      status,
    } = req.body;

    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !numberOfVolunteers ||
      !location ||
      !status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const allowedStatuses = ["Open", "Completed", "Working", "Cancelled"];

    if (req.body.status && !allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values are: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedOpportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json(updatedOpportunity);
  } catch (error) {
    res.status(500).json({ message: "Error updating opportunity", error });
  }
};

export const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOpportunity = await Opportunity.findByIdAndDelete(id);

    if (!deletedOpportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting opportunity", error });
  }
};

export const postOpportunity = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      numberOfVolunteers,
      location,
      skills,
      category,
    } = req.body;

    if (numberOfVolunteers <= 0) {
      return res
        .status(400)
        .json({ message: "number Of Volunteers must be greater than zero" });
    }

    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !numberOfVolunteers ||
      !location ||
      !category ||
      !skills
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOpportunity = new Opportunity({
      title,
      description,
      date,
      time,
      numberOfVolunteers,
      category,
      skills,
      location,
      status: "Open",
      //later remove this id just for testing purpose

      organization: "65a123456789abc123456789" || req.id,
    });

    // Save to database
    await newOpportunity.save();

    res.status(201).json({
      message: "Opportunity posted successfully",
      opportunity: newOpportunity,
    });
  } catch (error) {
    res.status(500).json({ message: "Error posting opportunity", error });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { opportunityId, volunteerId, status } = req.body;

    const validStatuses = ["Open", "Completed", "Working", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const updatedOpportunity = await Opportunity.findOneAndUpdate(
      {
        _id: opportunityId,
        "volunteerApplications.volunteer": volunteerId,
      },
      {
        $set: {
          "volunteerApplications.$.applicationStatus": status,
        },
      },
      { new: true }
    );

    if (!updatedOpportunity) {
      return res
        .status(404)
        .json({ message: "Opportunity or application not found" });
    }

    res.status(200).json({
      message: "Application status updated successfully",
      updatedOpportunity,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating application status", error });
  }
};

export const getApplicationsByOpportunity = async (req, res) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findById(id)
      .populate("volunteerApplications")
      .populate("volunteerApplications.volunteer");

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json(opportunity.volunteerApplications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const opportunity = await Application.find({})
      .populate("volunteerApplications")
      .populate("volunteerApplications.volunteer");

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.status(200).json(opportunity.volunteerApplications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications", error });
  }
};

// export const profiledata = async (req, res) => {
//   try {
//     const { name, email, currentPassword, newPassword, confirmPassword } =
//       req.body;

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "New passwords do not match" });
//     }

//     const user = await User.findById(req.user._id);

//     const passwordMatch = await bcrypt.compare(currentPassword, user.password);

//     if (!passwordMatch) {
//       return res.status(400).json({ message: "Current password is incorrect" });
//     }

//     let updatedData = { name, email };

//     if (newPassword) {
//       const salt = await bcrypt.genSalt(10);
//       updatedData.password = await bcrypt.hash(newPassword, salt);
//     }

//     if (!req.file) {
//       updatedData.avatar = user.avatar;
//     } else {
//       cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET,
//       });

//       const filePath = req.file.path;
//       const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
//         folder: "LVN_PROJECT",
//       });

//       updatedData.avatar = cloudinaryResponse.secure_url;
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       updatedData,
//       { new: true }
//     );

//     res.json({ success: true, user: updatedUser });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ message: "Error updating profile", error });
//   }
// };
