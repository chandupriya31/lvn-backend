import { opportunityschema } from "../models/opportunity.model.js";

export const getOpportunitiesByOrganization = async (req, res) => {
  try {
    const { itemsPerPage, pageNumber } = req.query;
    
    //later remove this id just for testing purpose

    const orgId = "65a123456789abc123456789"||  req.id  ;

    const limit = parseInt(itemsPerPage);
    const skip = (parseInt(pageNumber) - 1) * limit;

    
    const opportunities = await opportunityschema
    .find({ organization: orgId })
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
      return res
        .status(400)
        .json({
          message: `Invalid status. Allowed values are: ${allowedStatuses.join(
            ", "
          )}`,
        });
    }

    const updatedOpportunity = await opportunityschema.findByIdAndUpdate(
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

    const deletedOpportunity = await opportunityschema.findByIdAndDelete(id);

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

    const newOpportunity = new opportunityschema({
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

    res
      .status(201)
      .json({
        message: "Opportunity posted successfully",
        opportunity: newOpportunity,
      });
  } catch (error) {
    res.status(500).json({ message: "Error posting opportunity", error });
  }
};
