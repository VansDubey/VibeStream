import { connect } from "@/src/app/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";
import { NextResponse,NextRequest } from "next/server";

connect()

export async function POST(request : NextRequest){
    try {

        const reqBody = await request.json();
        const {password} = reqBody;

        if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

     const token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid token" },
        { status: 400 }
      );
    }

    const user = await User.findOne
        ({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

     if (!user) {
      return NextResponse.json(
        { success: false, message: "Token expired or invalid" },
        { status: 400 }
      );
    }

    //hash new password
    const hashedPassword = await bcrypt.hash(password,10);

    // Updating the new password:
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined,
    user.forgotPasswordTokenExpiry = undefined

    await user.save();

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );

        // token => user_id => database => password fiedl upgrade => return
        
    } catch (error:any) {
        return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
        
    }

}

