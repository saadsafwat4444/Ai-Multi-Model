"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/config";
import { getAuthHeaders } from "@/utils/auth";
import EditTitleModal from '../components/EditTitleModal';

export default function Sidebar({ onSelectChat, model, refreshKey }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editModal, setEditModal] = useState({ isOpen: false, chatId: null, chatTitle: '' });

  // Function to fetch history
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/chat/history${model ? `?model=${model}` : ''}`, { 
        headers: getAuthHeaders()
      });
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

  const handleEditTitle = (chatId, chatTitle) => {
    setEditModal({ isOpen: true, chatId, chatTitle });
  };

  const handleUpdateTitle = (chatId, newTitle) => {
    setHistory(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  const handleLogout = () => {
    console.log('=== Logout Process Started ===');
    
    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      // Debug: Show all localStorage items before clearing
      console.log('Before clear - localStorage items:', Object.keys(localStorage));
      console.log('Token exists:', !!localStorage.getItem('token'));
      
      // Clear token
      localStorage.removeItem('token');
      
      // Clear all selected chat IDs
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('selectedChatId_')) {
          console.log('Removing:', key);
          localStorage.removeItem(key);
        }
      });
      
      // Debug: Show localStorage after clearing
      console.log('After clear - localStorage items:', Object.keys(localStorage));
      console.log('Token exists after clear:', !!localStorage.getItem('token'));
      
      // Force clear everything as backup
      localStorage.clear();
      console.log('localStorage cleared completely');
    }
    
    // Redirect to login
    console.log('Redirecting to login...');
    window.location.href = '/auth/login';
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const res = await fetch(`${API_URL}/chat/${chatId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (res.ok) {
        // Remove from local state immediately
        setHistory(prev => prev.filter(chat => chat.id !== chatId));
        
        // Check if deleted chat was the current one
        if (typeof window !== 'undefined') {
          const currentChatId = localStorage.getItem(`selectedChatId_${model}`);
          if (currentChatId === chatId) {
            localStorage.removeItem(`selectedChatId_${model}`);
            onSelectChat(null);
          }
        }
        
        setDeleteConfirm(null);
        
        // Refresh history to ensure sync with server
        await fetchHistory();
        
        // Show success message
        toast.success('Chat deleted successfully!');
        
        // Wait 1.5 seconds to show the deletion effect, then refresh
        setTimeout(() => {
          window.location.reload();
        }, 1900);
      } else {
        alert('Error deleting chat. Please try again.');
        console.error('Failed to delete chat:', res.status);
        alert('Failed to delete chat. Please try again.');
      }
    } catch (err) {
      console.error("Error deleting chat:", err);
      alert('Error deleting chat. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { 
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else if (res.status === 401) {
          // Redirect to login if unauthorized
          window.location.href = '/auth/login';
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        // On error, also redirect to login
        window.location.href = '/auth/login';
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
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
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-gray-800 transition-colors"
              title="Logout"
            >
              🚪
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <button
            className="w-full mb-3 px-3 py-2 bg-red-500 rounded hover:bg-red-600 transition-colors text-sm"
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
                className="px-3 py-2 rounded hover:bg-gray-700 cursor-pointer transition-colors text-sm flex justify-between items-center group"
                onClick={() => {
                  onSelectChat(chat.id);
                  setIsSidebarOpen(false);
                }}
              >
                <div className="truncate flex-1">{chat.title}</div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTitle(chat.id, chat.title);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="Edit title"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(chat.id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete chat"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Confirmation Dialog */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm mx-4">
                <h3 className="text-white font-semibold mb-4">Delete Chat?</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this chat? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleDeleteChat(deleteConfirm)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto text-gray-400 text-xs text-center pt-4 border-t border-gray-700">
          &copy; 2026 AI Dashboard
        </div>
      </aside>
      
      {/* Edit Title Modal */}
      <EditTitleModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, chatId: null, chatTitle: '' })}
        chatTitle={editModal.chatTitle}
        chatId={editModal.chatId}
        onUpdate={handleUpdateTitle}
      />
    </>
  );
}
