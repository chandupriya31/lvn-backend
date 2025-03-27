import { Opportunity } from "../models/opportunity.model.js";

export const getOpportunitiesByOrganization = async (req, res) => {
  try {
    const { itemsPerPage, pageNumber } = req.query;

    //later remove this id just for testing purpose

    const orgId = "65a123456789abc123456789" || req.id;
    const limit = parseInt(itemsPerPage);
    const skip = (parseInt(pageNumber) - 1) * limit;

    const opportunities = await Opportunity.find({ organization: orgId })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(pageNumber),
      itemsPerPage: limit,
      opportunities,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching opportunities", error });
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

    const allowedStatuses = ["Posted", "Closed", "Completed"];

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
    const { title, description, date, time, numberOfVolunteers, location } =
      req.body;

    if (
      !title ||
      !description ||
      !date ||
      !time ||
      !numberOfVolunteers ||
      !location
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOpportunity = new Opportunity({
      title,
      description,
      date,
      time,
      numberOfVolunteers,
      location,
      status: "Posted",
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

    const validStatuses = ["Pending", "Accepted", "Rejected"];
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
    const opportunity = await Opportunity.find({})
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
