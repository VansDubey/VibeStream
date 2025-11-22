"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  // ----------------------------------
  // FORGOT PASSWORD HANDLER
  // ----------------------------------
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      const res = await axios.post("/api/users/sendForgetPasswordMail", { email });

      alert(res.data.message || "Reset email sent.");
    } catch (error: any) {
      alert(error.response?.data?.message || "Error sending reset email");
    }
  };

  // ----------------------------------
  // LOGIN SUBMIT
  // ----------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/users/Login", {
        email,
        password,
      });

      alert("Login Successful!");
      router.push("/profile");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-2 border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700
            text-white py-2 rounded-lg transition"
          >
            Login
          </button>

          {/* Forgot Password */}
          <p className="text-center text-sm mt-2">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </p>

          {/* Sign Up Link */}
          <p className="text-center text-sm mt-3">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
