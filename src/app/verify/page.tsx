"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const id = queryParams.get("id");

    if (!token) {
      setMessage("No token found in URL ❌");
      return;
    }

    verifyEmail(token, id || "");
  }, []);

  const verifyEmail = async (tokenValue: string, idValue: string) => {
    try {
      const res = await axios.post("/api/users/verifyEmail", {
        token: tokenValue,
        id: idValue,
      });

      if (res.data.success) {
        setMessage("Email Verified Successfully ✔");
      } else {
        setMessage(res.data.message || "Verification Failed ❌");
      }
    } catch (error: any) {
      console.error(error);
      setMessage("Verification Failed ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Email Verification</h2>
      <p>{message}</p>
    </div>
  );
}
