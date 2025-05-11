import User, { UserType } from "@/utils/user";
import dbConnect from "@/utils/dbConnect";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    await dbConnect();

    const address = req.nextUrl.searchParams.get('address');
    if(!address) {
        return NextResponse.json({ error: "Please provide an address" }, { status: 400 });
    }

    const user = await User.findOne({ address });
    if (!user) {
        return NextResponse.json({ error: "User not found: " + address }, { status: 400 });
    }

    const referees = await User.find({ referral: address });
    referees.forEach((referee) => {
        user.tokens += Math.floor(referee.tokens / 100);
    });
    return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
    await dbConnect();

    const action = req.nextUrl.searchParams.get('action');
    if(action === "update"){
        const userModel: UserType = await req.json();
        
        const referees = await User.find({ referral: userModel.address });
        referees.forEach((referee) => {
            userModel.tokens -= Math.floor(referee.tokens / 100);
        });

        console.log("Updating user model with:", userModel);

        await User.findByIdAndUpdate(userModel._id, userModel);
        return NextResponse.json({ message: "User updated" });
    }

    const address = req.nextUrl.searchParams.get('address');
    const { username, referral } = await req.json();
    if(!username || !address){
        return NextResponse.json({ error: "Address and username required" }, { status: 400 });
    }

    const newUser = new User({
        address,
        username,
        referral,
        tokens: 0,
        gold: 0,
        exp: 0,
        level: 1,
        highScore: 0,
        pet: {
            isLightOn: true,
            hunger: 10000,
            hygiene: 10000,
            energy: 10000,
            fun: 10000
        }
    });

    try{
        await newUser.save();
    }
    catch (err: any) {
        if(err.toString().includes("E11000 duplicate key error collection")){
            return NextResponse.json({ error: "Username already in use" }, { status: 409 });
        }
        console.error(err.toString());
        return NextResponse.json({ error: err.toString() }, { status: 500 });
    }
    
    return NextResponse.json(newUser);
}