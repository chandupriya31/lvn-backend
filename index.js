import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import configDB from './config/db.js';

dotenv.config()
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

configDB();

app.listen(port, () => {
    console.log("connected to port");
})