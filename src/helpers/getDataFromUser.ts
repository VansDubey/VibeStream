import jwt, { TokenExpiredError } from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromUser = (request: NextRequest) => {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      throw new Error("No token found");
    }

    // Verify token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    return decodedToken.id;  // Return user id or full object as required
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error("Token expired");
    }
    throw new Error("Invalid token");
  }
};
