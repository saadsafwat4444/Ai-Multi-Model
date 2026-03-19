"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header({ model }) {
  const [modelDropdown, setModelDropdown] = useState(false);
  const [menuDropdown, setMenuDropdown] = useState(false);
  const router = useRouter();

  const handleModelChange = (selectedModel) => {
    router.push(`/dashboard?model=${selectedModel}`);
    setModelDropdown(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/auth/login");
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-900 shadow-md">
      <div className="flex items-center mb-2 sm:mb-0">
        <h1 className="text-xl font-bold text-gray-100">AI Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            className="font-semibold px-4 py-2 rounded bg-gray-700 text-gray-100 hover:bg-gray-600 transition-colors"
            onClick={() => setModelDropdown(!modelDropdown)}
          >
            {model}
          </button>

          {modelDropdown && (
            <ul className="absolute mt-2 w-36 bg-gray-700 text-gray-100 border border-gray-600 rounded shadow-lg z-50">
              <li
                className="px-4 py-2 hover:bg-gray-600 cursor-pointer transition-colors"
                onClick={() => handleModelChange("gemini")}
              >
                Gemini
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-600 cursor-pointer transition-colors"
                onClick={() => handleModelChange("gpt")}
              >
                ChatGPT
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-600 cursor-pointer transition-colors"
                onClick={() => handleModelChange("grok")}
              >
                Grok
              </li>
            </ul>
          )}
        </div>

        <div className="relative">
          <button
            className="px-3 py-2 rounded bg-gray-700 text-gray-100 hover:bg-gray-600 transition-colors"
            onClick={() => setMenuDropdown(!menuDropdown)}
          >
            &#8230;
          </button>

          {menuDropdown && (
            <ul className="absolute right-0 mt-2 w-36 bg-gray-700 text-red-500 border border-gray-600 rounded shadow-lg z-50">
              <li
                className="px-4 py-2 hover:bg-gray-600 cursor-pointer transition-colors"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
