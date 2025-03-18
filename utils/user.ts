import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    referral: {
        type: String,
        required: true,
    },
    bluePoints: {
        type: Number,
        required: true,
    },
    bluePointsSpent: {
        type: Number,
        required: true,
    },
    goldPoints: {
        type: Number,
        required: true,
    },
    goldPointsSpent: {
        type: Number,
        required: true,
    },
    multiplier: {
        type: Number,
        required: true,
    },
    pet: {
        hunger: {
            type: Number,
            required: true,
        },
        higiene: {
            type: Number,
            required: true,
        },
        energy: {
            type: Number,
            required: true,
        },
        fun: {
            type: Number,
            required: true,
        },
    },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;

export type UserType = {
    address: string,
    username: string,
    referral: string,
    bluePoints: string,
    bluePointsSpent: string,
    goldPoints: string,
    goldPointsSpent: string,
    multiplier: string,
    pet: {
        hunger: string,
        higiene: string,
        energy: string,
        fun: string
    }
}