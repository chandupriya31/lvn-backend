import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import configDB from './config/db.js';
import organizationRouter from './app/routes/organizationroutes.js';

dotenv.config()
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

configDB();

app.use("/api/organization",organizationRouter)

app.listen(port, () => {
    console.log("connected to port");
})