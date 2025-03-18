import User from "@/utils/user";
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
        user.bluePoints += Math.floor(referee.bluePoints / 100);
    });

    user.bluePoints -= user.bluePointsSpent;
    user.goldPoints -= user.goldPointsSpent;

    return NextResponse.json({ address: user.address, username: user.username, referral: user.referral, bluePoints: user.bluePoints, goldPoints: user.goldPoints, pet: user.pet });
}

export async function POST(req: NextRequest) {
    await dbConnect();

    const address = req.nextUrl.searchParams.get('address');
    const { username, referral } = await req.json();
    if(!username || !address){
        return NextResponse.json({ error: "Address and username required" }, { status: 400 });
    }

    const newUser = new User({
        address,
        username,
        referral,
        bluePoints: 0,
        bluePointsSpent: 0,
        goldPoints: 0,
        goldPointsSpent: 0,
        multiplier: 1,
        pet: {
            hunger: 100,
            higiene: 100,
            energy: 100,
            fun: 100
        }
    });

    try{
        newUser.save();
    }
    catch (err: any) {
        console.error(err.toString());
        return NextResponse.json({ error: err.toString() }, { status: 500 });
    }
    
    return NextResponse.json(newUser);
}