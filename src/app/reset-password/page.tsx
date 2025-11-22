"use client";

import { useState, useEffect } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("token"));
      setId(params.get("id"));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !id) {
      setMessage("Invalid or missing reset credentials.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          id,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Password reset failed");

      setMessage("Password reset successful!");
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="password"
          required
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, fontSize: 16 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 10, fontSize: 16 }}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>

      {message && <p style={{ marginTop: 12, fontWeight: 500 }}>{message}</p>}
    </div>
  );
}
