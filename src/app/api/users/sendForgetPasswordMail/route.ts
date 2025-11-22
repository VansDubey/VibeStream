import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/src/app/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/src/helpers/mailer";

connect();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    // // Optional: Save token in DB
    // user.resetToken = token;
    // user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    // await user.save();

    // 👇 Send reset email
    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id.toString()
    });

    return NextResponse.json(
      { success: true, message: "Reset email sent" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Forgot Password Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
