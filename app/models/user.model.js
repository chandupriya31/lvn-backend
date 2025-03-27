import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    avatar: String,
    otp: Number,
    is_verified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'volunteer',
        enum: ['admin', 'volunteer', 'organization']
    }
}, { timestamps: true })

export const User = model('User', userSchema)