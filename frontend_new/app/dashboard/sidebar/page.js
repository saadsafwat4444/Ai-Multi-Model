"use client";

import { useState, useEffect } from "react";

export default function Sidebar({ onSelectChat, model, refreshKey }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDeleteChat = async (chatId) => {
    try {
      const res = await fetch(`http://localhost:9999/chat/${chatId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (res.ok) {
        setHistory(prev => prev.filter(chat => chat.id !== chatId));
        
        if (typeof window !== 'undefined') {
          const currentChatId = localStorage.getItem(`selectedChatId_${model}`);
          if (currentChatId === chatId) {
            localStorage.removeItem(`selectedChatId_${model}`);
            onSelectChat(null);
          }
        }
        
        window.location.reload();
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/check", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:9999/chat/history${model ? `?model=${model}` : ''}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [onSelectChat, refreshKey, model]);

  if (loading) {
    return (
      <aside className="fixed lg:relative lg:w-64 w-64 min-h-screen bg-gray-900 text-gray-100 shadow-lg p-4 flex flex-col z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gray-700 animate-pulse"></div>
          <div className="ml-3">
            <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        <div className="space-y-1">
          <div className={`w-6 h-0.5 bg-gray-100 transition-transform duration-300 ${isSidebarOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-gray-100 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-gray-100 transition-transform duration-300 ${isSidebarOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </div>
      </button>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:relative lg:w-64 w-64 min-h-screen bg-gray-900 text-gray-100 shadow-lg p-4 flex flex-col z-50 transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {user && (
          <div className="flex items-center mb-6">
            <img
              src={user.avatar || 'https://via.placeholder.com/150'}
              alt={user.name || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="font-semibold text-sm sm:text-base">{user.name || 'User'}</p>
              <p className="text-xs text-gray-400 hidden sm:block">{user.email || 'user@example.com'}</p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <button
            className="w-full mb-3 px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm"
            onClick={() => {
              onSelectChat(null);
              setIsSidebarOpen(false);
            }}
          >
            + New Chat
          </button>
          <h2 className="text-gray-300 uppercase text-sm mb-2 font-medium">History</h2>
          
          <ul className="space-y-2">
            {history.map((chat) => (
              <li
                key={chat.id}
                className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer transition-colors text-sm flex justify-between items-center"
                onClick={() => {
                  onSelectChat(chat.id);
                  setIsSidebarOpen(false);
                }}
              >
                <div className="truncate flex-1">{chat.title}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                  title="Delete chat"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto text-gray-400 text-xs text-center pt-4 border-t border-gray-700">
          &copy; 2026 AI Dashboard
        </div>
      </aside>
    </>
  );
}
