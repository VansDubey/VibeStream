import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Create a response
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    // Clear JWT cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
