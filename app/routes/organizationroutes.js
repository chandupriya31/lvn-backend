import express from "express"
import { deleteOpportunity, getOpportunitiesByOrganization, postOpportunity, updateOpportunity } from "../controllers/organizationcontroller.js"

const organizationRouter=express.Router()

organizationRouter.get("/getallopportunitiesbyorganization",getOpportunitiesByOrganization)
organizationRouter.post("/postopportunity",postOpportunity)
organizationRouter.put("/updateopportunity/:id",updateOpportunity)
organizationRouter.delete("/deleteopportunity/:id",deleteOpportunity)


export default organizationRouter