import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config({ path: "./.env" });

app.get("/", (req, res) => {
    res.send("Welcome to the server");
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running`);
        });
    })
    .catch((err) => {
        console.log(`Unable to connect mongoDB server.... ${err}`);
    });