import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/databases/db";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import User from '@/models/userModel'

connect();

export async function POST(req: NextRequest){
    try {
        const reqBody = await req.json();
        const {email, password} = reqBody;

        console.log(reqBody)

        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json({
                message: "User does not exists",
                success: false
            }, {status:400})
        }

        console.log("user exists");

        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return NextResponse.json({
                message: "Password Incorrect",
                success: false
            }, {status:400})
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, {expiresIn: '1d'});

        const response = NextResponse.json({
            message: "Login successfully",
            success: true
        })

        response.cookies.set("token", token, {
            httpOnly: true
        })

        return response;

    } catch (error:any) {
        return NextResponse.json({
            sucess: false,
            error: error.message
        },
        {status: 500})
    }
}