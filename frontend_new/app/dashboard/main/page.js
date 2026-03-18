"use client";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Main({ selectedChatId, model }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(selectedChatId || null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      setChatId(null);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:9999/chat/${selectedChatId}/messages`,
          { 
            credentials: "include",
            headers: {
              "Authorization": `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1")}`
            }
          }
        );

        if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);

        const data = await res.json();
        const messagesArray = Array.isArray(data) ? data : data.messages;

        const formatted = messagesArray.map((msg) => ({
          id: Math.random(),
          sender: msg.role === "user" ? "User" : "AI",
          text: msg.content,
        }));

        setMessages(formatted);
        setChatId(selectedChatId);
      } catch (err) {
        console.error("Error fetching messages:", err);
        toast.error("حدث خطأ أثناء جلب الرسائل.");
      }
    };

    fetchMessages();
  }, [selectedChatId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userTempId = Date.now();
    setMessages(prev => [
      ...prev,
      { id: userTempId, sender: "User", text: input },
    ]);

    const userMessage = input;
    setInput("");

    try {
      const res = await fetch("http://localhost:9999/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          chatId: chatId ?? null,
          selectedModel: model,
          message: userMessage,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to send message: ${res.status}`);
      }

      const data = await res.json();
      console.log("Server response:", data);

      if (data.userMessage?.chat?.id) setChatId(data.userMessage.chat.id);

      const aiText = data.aiMessage?.content || "لا يوجد رد من AI.";

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: "AI", text: aiText },
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("حدث خطأ أثناء إرسال الرسالة.");

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 2, sender: "AI", text: "حدث خطأ أثناء الاتصال بالـ AI." },
      ]);
    }
  };

  return (
    <>
      <main className="flex-1 bg-gray-800 text-gray-100 p-4 flex flex-col rounded-l-lg">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto mb-4 space-y-3 flex flex-col"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-lg">
              Ready when you are.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg break-words ${
                  msg.sender === "User"
                    ? "bg-gray-700 self-end text-right"
                    : "bg-gray-600 self-start text-left"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </main>

      <ToastContainer />
    </>
  );
}
