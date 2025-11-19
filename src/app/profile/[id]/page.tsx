"use client";

import { useParams } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6">

        <div className="flex flex-col items-center">
          <Image
            src="/profile.jpg"
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full border-4 border-gray-200"
          />

          <h1 className="text-3xl font-semibold mt-4">{id}</h1>
          <p className="text-gray-500">{id}</p>
        </div>

      </div>
    </div>
  );
}
