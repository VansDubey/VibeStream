import { NextRequest, NextResponse } from "next/server";
import User from "@/src/models/userModel";
import { connect } from "@/src/app/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/src/helpers/mailer";

connect();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // ⚠️ Do NOT hash here — the schema will handle it
    const user = await User.create({ name, email, password });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    //Send the verification Email
    await sendEmail({ email: user.email, emailType: "VERIFY", userId: user._id.toString(), });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully!",
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
