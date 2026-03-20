"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/config";
import { getAuthHeaders } from "@/utils/auth";
import Header from "./header/page";
import Sidebar from "./sidebar/page";
import Main from "./main/page";
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
        
        const response = await fetch("/api/auth/check", {
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
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <Header model={model} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectChat={setSelectedChatId} model={model} />
        <Main selectedChatId={selectedChatId} model={model} />
      </div>
    </div>
  );
}
