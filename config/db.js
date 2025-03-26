import mongoose from "mongoose";

const configDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log('Connected to DB');
    } catch (err) {
        console.log('error connecting to db', err);
    }
}

export default configDB