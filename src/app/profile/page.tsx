"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";


 axios.defaults.withCredentials = true;

export default function ProfilePage() {
  const router = useRouter();
 const [data, setdata] = useState("Nothing");


  const getData = async ()=>{
    const res = await axios.get("/api/users/me");
    console.log(res);
    setdata(res.data.data._id);
  }

  const logout = async () => {
    try {
      const res = await axios.get("/api/users/Logout");
      console.log(res.data.message);
      router.push("/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={logout}
          className="p-2 border bg-black text-white rounded-b-sm"
        >
          Logout
        </button>
        <h2> {data === "Nothing" ? "No data yet" : ( <Link href={`/profile/${data}`}> Go to Full Profile </Link> )} </h2>
        <button className="p-2 border bg-black text-white rounded-b-sm" onClick = {getData}>getUserData</button>
      </div>
    </div>
  );
}
