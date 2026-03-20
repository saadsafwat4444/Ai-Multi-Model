"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/config";
import { getAuthHeaders } from "@/utils/auth";
import Header from "./header/page";
import Sidebar from "./sidebar/page";
import Main from "./main/page";

// Simple logout button component
const LogoutButton = () => {
  const handleLogout = () => {
    // Clear sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('token');
      localStorage.clear();
    }
    
    // Redirect to login
    window.location.href = '/auth/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition-colors z-50"
      title="Logout"
    >
      🚪 Logout
    </button>
  );
};
import { useSearchParams } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const model = searchParams.get("model") || "gemini"; 
  const [loading, setLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const loadChat = async () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const chatId = urlParams.get('chatId');
      
      if (chatId) {
        setSelectedChatId(chatId);
      } else {
        try {
          const res = await fetch(`${API_URL}/chat/history?model=${model}`, { 
            credentials: "include" 
          });
          if (res.ok) {
            const data = await res.json();
            if (data.length > 0) {
              setSelectedChatId(data[0].id);
            }
          }
        } catch (err) {
          console.error("Error fetching first chat:", err);
        }
      }
    }
  };

  useEffect(() => {
    loadChat();
  }, [model]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Debug: Check if token exists in localStorage
        console.log('=== Dashboard Auth Check ===');
        const token = localStorage.getItem('token');
        console.log('Token in localStorage:', !!token);
        console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null');
        console.log('Auth headers:', getAuthHeaders());
        
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          router.push("/auth/login");
        } else {
          setLoading(false);
        }
      } catch (error) {
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-100 bg-gray-900">
        Checking Authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <LogoutButton />
      <div className="flex">
        <Sidebar onSelectChat={setSelectedChatId} model={model} refreshKey={refreshKey} />
        <Main selectedChatId={selectedChatId} model={model} />
      </div>
    </div>
  );
}
