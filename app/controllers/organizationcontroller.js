import { opportunityschema } from "../models/opportunity.model.js";

export const getOpportunitiesByOrganization = async (req, res) => {
  try {
    const opportunities = await opportunityschema.find({
      organization: req.id,
    });
    res.status(200).json(opportunities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching opportunities", error });
  }
};



export const updateOpportunity = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, date, time, numberOfVolunteers, location, status } = req.body;
  
      
      if (!title || !description || !date || !time || !numberOfVolunteers || !location || !status) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const updatedOpportunity = await opportunityschema.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedOpportunity) {
        return res.status(404).json({ message: 'Opportunity not found' });
      }
  
      res.status(200).json(updatedOpportunity);
    } catch (error) {
      res.status(500).json({ message: 'Error updating opportunity', error });
    }
  };



 export const deleteOpportunity = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedOpportunity = await opportunityschema.findByIdAndDelete(id);
  
      if (!deletedOpportunity) {
        return res.status(404).json({ message: 'Opportunity not found' });
      }
  
      res.status(200).json({ message: 'Opportunity deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting opportunity', error });
    }
  };
  
  

 export  const postOpportunity = async (req, res) => {
    try {
      const { title, description, date, time, numberOfVolunteers, location } = req.body;
      
      if (!title || !description || !date || !time || !numberOfVolunteers || !location) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      const newOpportunity = new opportunityschema({
        title,
        description,
        date,
        time,
        numberOfVolunteers,
        location,
        status:  'Posted',  
        organization: req.id  
      });
  
      // Save to database
      await newOpportunity.save();
  
      res.status(201).json({ message: 'Opportunity posted successfully', opportunity: newOpportunity });
    } catch (error) {
      res.status(500).json({ message: 'Error posting opportunity', error });
    }
  };
  
