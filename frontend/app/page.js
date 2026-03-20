
"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Redirect to login page
    window.location.href = "/auth/login";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-white">Redirecting to login...</div>
    </div>
  );
}
