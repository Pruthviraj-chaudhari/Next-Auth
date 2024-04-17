import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/databases/db";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";

connect();

export async function GET(req: NextRequest){
    // extract data from token
    const userId = await getDataFromToken(req)

    const user = await User.findOne({_id: userId}).select("-password");

    if(!user){
        return NextResponse.json({
            message: "User not found",
            success: false
        }, {status: 400})
    }

    return NextResponse.json({
        message: "User found",
        success: true,
        data: user
    })
}