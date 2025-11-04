import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  createdAt?: string;
}

interface ChatRoomProps {
  userId: string;
  receiverId: string;
  onBack?: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ userId, receiverId, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    socketRef.current = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id);
    });

    socketRef.current.on("receive_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("message_sent", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userId && receiverId) {
      api
        .get(`/chat/messages?senderId=${userId}&receiverId=${receiverId}`)
        .then((res) => setMessages(res.data.data || res.data))
        .catch((err) => console.error("Error fetching messages:", err));
    }
  }, [userId, receiverId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const message = { senderId: userId, receiverId, content: input };
    socketRef.current?.emit("send_message", message);
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const groupedMessages = messages.reduce((groups: any, msg) => {
    const date = formatDate(msg.createdAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full bg-gray-100 sm:rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-3 sm:p-5 text-base sm:text-lg font-semibold flex items-center justify-between">
        <button
          onClick={onBack}
          className="md:hidden text-white mr-2"
          aria-label="Go back"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <span className="hidden sm:inline">Chat</span>
      </div>

      <div className="flex-1 p-2 sm:p-4 overflow-y-auto space-y-4">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="text-center text-gray-700 text-xs mb-3 relative">
              <span className="bg-gray-300 px-3 py-1 rounded-full shadow-sm font-medium text-[11px] sm:text-xs">
                {date}
              </span>
            </div>

            {groupedMessages[date].map((msg: Message, idx: number) => (
              <div
                key={idx}
                className={`flex flex-col w-fit max-w-[80%] sm:max-w-xs p-2 sm:p-3 rounded-xl mt-2 break-words ${
                  msg.senderId === userId
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-300 text-gray-900"
                }`}
              >
                <span className="text-sm sm:text-base">{msg.content}</span>
                {msg.createdAt && (
                  <span className="text-[10px] sm:text-xs opacity-70 text-right mt-1">
                    {formatTime(msg.createdAt)}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 p-2 sm:p-3 border-t bg-gray-300">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border border-gray-400 rounded-full px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default ChatRoom;