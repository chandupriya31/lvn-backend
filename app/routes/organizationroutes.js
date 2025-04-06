import express from "express"
import { deleteOpportunity, getAllApplications, getApplicationsByOpportunity,getOpportunitiesByOrganization, postOpportunity, updateApplicationStatus, updateOpportunity } from "../controllers/organizationcontroller.js"
import { upload } from "../../multer/multer.js"

const organizationRouter=express.Router()

organizationRouter.get("/getallopportunitiesbyorganization",getOpportunitiesByOrganization)
organizationRouter.get("/getAllApplications",getAllApplications)
organizationRouter.get("/getApplicationsByOpportunity/:id",getApplicationsByOpportunity)
// organizationRouter.post("/profiledata",upload.single('file'),profiledata)
organizationRouter.post("/postopportunity",postOpportunity)
organizationRouter.put("/updateApplicationStatus",updateApplicationStatus)
organizationRouter.put("/updateopportunity/:id",updateOpportunity)
organizationRouter.delete("/deleteopportunity/:id",deleteOpportunity)


export default organizationRouter