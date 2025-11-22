import { connect } from "@/src/app/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";

connect();

export async function POST(request: NextRequest) {
try {
const reqBody = await request.json();
const { token, id } = reqBody;

if (!token || !id) {
  return NextResponse.json(
    { error: "Token and user id required" },
    { status: 400 }
  );
}

// 1️⃣ Find user
const user = await User.findById(id).select(
  "verifyToken verifyTokenExpiry"
);

if (!user) {
  return NextResponse.json({ error: "User not found" }, { status: 404 });
}

// 2️⃣ Check if token expired
if (user.verifyTokenExpiry < Date.now()) {
  return NextResponse.json(
    { error: "Token expired" },
    { status: 400 }
  );
}

// 3️⃣ Compare hashed token
const isValid = await bcrypt.compare(token, user.verifyToken);

if (!isValid) {
  return NextResponse.json(
    { error: "Invalid verification token" },
    { status: 400 }
  );
}

// 4️⃣ Mark as verified
user.verifyToken = undefined;
user.verifyTokenExpiry = undefined;
user.isVerified = true;  // Add this field in schema if needed

await user.save();

return NextResponse.json(
  { message: "Email verified successfully" },
  { status: 200 }
);


} catch (error: any) {
return NextResponse.json(
{ error: error.message },
{ status: 500 }
);
}
}
