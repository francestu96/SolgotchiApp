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
        required: false,
    },
    tokens: {
        type: Number,
        required: true,
    },
    gold: {
        type: Number,
        required: true,
    },
    exp: {
        type: Number,
        required: true,
    },
    level: {
        type: Number,
        required: true,
    },
    highScore: {
        type: Number,
        required: true,
    },
    activeWallpaperId: {
        type: String,
        required: false,
    },
    activeClothId: {
        type: String,
        required: false,
    },
    inventory: [{
            id: {
                type: String,
                required: false,
            },
            quantity: {
                type: Number,
                required: true,
            }
    }],
    pet: {
        name: {
            type: String,
            required: false,
        },
        isLightOn: {
            type: Boolean,
            required: true,
        },
        hunger: {
            type: Number,
            required: true,
        },
        hygiene: {
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
    _id: string,
    address: string,
    username: string,
    referral: string,
    tokens: number,
    gold: number,
    exp: number,
    level: number,
    highScore: number,
    activeWallpaperId: string,
    activeClothId: string,
    inventory: {
            id: string,
            quantity: number,
    }[],
    pet: {
        name: string,
        isLightOn: boolean,
        hunger: number,
        hygiene: number,
        energy: number,
        fun: number
    }
}