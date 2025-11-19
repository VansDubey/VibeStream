import { getDataFromUser } from "@/src/helpers/getDataFromUser";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extract user ID from token
    const userId = getDataFromUser(request);

    // Find the user in DB
    const user = await User.findOne({ _id: userId }).select("-password");

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }
}
