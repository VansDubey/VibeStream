import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/userModel";

export const sendEmail = async ({
email,
emailType,
userId,
}: {
email: string;
emailType: "VERIFY" | "RESET";
userId: string;
}) => {
try {
// 1️⃣ Generate a random token
const rawToken =
Math.random().toString(36).substring(2) +
Math.random().toString(36).substring(2);

// 2️⃣ Hash token
const hashedToken = await bcrypt.hash(rawToken, 10);

// 3️⃣ Save token in DB
if (emailType === "VERIFY") {
  await User.findByIdAndUpdate(userId, {
    verifyToken: hashedToken,
    verifyTokenExpiry: Date.now() + 1000 * 60 * 60, // 1 hour
  });
} else {
  await User.findByIdAndUpdate(userId, {
    forgotPasswordToken: hashedToken,
    forgotPasswordTokenExpiry: Date.now() + 1000 * 60 * 30, // 30 min
  });
}

// 4️⃣ Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// 5️⃣ Create email link
const link =
  emailType === "VERIFY"
    ? `${process.env.DOMAIN}/verify?token=${rawToken}&id=${userId}`
    : `${process.env.DOMAIN}/reset-password?token=${rawToken}&id=${userId}`;

// 6️⃣ Subject
const subject =
  emailType === "VERIFY"
    ? "Verify your email"
    : "Reset your account password";

// 7️⃣ Send email
const mailResponse = await transporter.sendMail({
  from: "no-reply@demomailtrap.co",
  to: "dvanshika32@gmail.com",
  subject,
  html: `
    <p>You requested: <b>${emailType}</b></p>
    <p>Click below to proceed:</p>
    <a href="${link}">Click Here</a>
    <br/><br/>
    <p>If you didn't request this, ignore this email.</p>
  `,
});

return mailResponse;


} catch (error: any) {
console.error("Email Error:", error.message);
throw new Error(error.message);
}
};
