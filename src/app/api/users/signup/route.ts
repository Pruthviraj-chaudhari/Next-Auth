import {connect} from '@/databases/db'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/helpers/mailer';

connect();

export async function POST(req: NextRequest){
    try {
        const reqBody = await req.json();

        const {username, email, password} = reqBody;

        console.log(reqBody);

        const user = await User.findOne({email});

        if(user){
            return NextResponse.json({
                error: "User already registered"
            }, {status: 400});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save();
        console.log(savedUser);

        //send verification email
        sendVerificationEmail(email, savedUser._id);

        return NextResponse.json({
            message: "User Registered Successfully",
            success: true,
            savedUser
        })
    } catch (error:any) {
        return NextResponse.json({
            sucess: false,
            error: error.message
        },
        {status: 500})
    }
}