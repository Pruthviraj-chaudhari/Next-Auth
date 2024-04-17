import { NextRequest, NextResponse } from 'next/server'
import {connect} from '@/databases/db'
import User from '@/models/userModel'

connect();

export async function POST(req: NextRequest){
    try {
        const reqBody = await req.json();
        const {token} = reqBody;
        console.log(token)

        const user = await User.findOne({ verifyToken:token, verifyTokenExpiry: {$gt: Date.now()} });

        if(!user){
            return NextResponse.json({
                message: "Invalid Token"
            }, {status:400})
        }

        console.log(user);

        user.isVerified = true;
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        }, {status:200})

    } catch (error:any) {
        return NextResponse.json({
            error: error.message
        }, {status:500})
    }
}