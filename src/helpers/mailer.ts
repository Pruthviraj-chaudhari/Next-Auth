import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import { v4 as uuidv4 } from 'uuid';

const mailSender = async (
  email: string,
  title: string,
  body: string
) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "Next Auth",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    return info;
  } catch (error: any) {
    console.log("Error occured at mailSender: ", error.message);
  }
};

export async function sendVerificationEmail(email: string, userId: string) {
  try {
    const newToken = uuidv4();

    await User.findByIdAndUpdate(userId, {
      verifyToken: newToken,
      verifyTokenExpiry: Date.now() + 3600000,
    });

    const verifyUrl = `${process.env.DOMAIN}/verifyemail?token=${newToken}`;

    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>
        <br>
        <p>Or copy and paste the link below in your browser.</p>
        <br>
        <P>${verifyUrl}</P>`
    );
  } catch (error) {
    console.log("Error occurred while sending verification email: ", error);
    throw error;
  }
}

export async function sendResetPasswordEmail(email: string, userId: string) {
  try {
    const newToken = await bcrypt.hash(userId.toString(), 10);

    await User.findByIdAndUpdate(userId, {
      forgotPasswordToken: newToken,
      forgotPasswordTokenExpiry: Date.now() + 3600000,
    });

    const resetUrl = `${process.env.DOMAIN}/resetpassword?token=${newToken}`;

    const mailResponse = await mailSender(
      email,
      "Reset your Password",
      `<p>Click <a href="${resetUrl}">here</a> to reset your passsword.</p>
        <br>
        <p>Or copy and paste the link below in your browser.</p>
        <br>
        <P>${resetUrl}</P>`
    );

  } catch (error) {
    console.log("Error occurred while sending verification email: ", error);
    throw error;
  }
}
