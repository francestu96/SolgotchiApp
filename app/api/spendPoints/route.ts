import User from "@/utils/user";
import dbConnect from "@/utils/dbConnect";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { address, pointsSpent } = await req.json();
    if(!address || !pointsSpent) {
        return NextResponse.json({ error: "Please provide an address and pointsSpent" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ address });
    if (!user) {
        return NextResponse.json({ error: "User not found: " + address }, { status: 400 });
    }
    if (user.bluePointsSpent + pointsSpent > user.bluePoints) {
        return NextResponse.json({ error: "Cannot exceed total points" }, { status: 400 });
    }

    user.bluePointsSpent += pointsSpent;
    await user.save();

    return NextResponse.json({ status: "ok" });
}