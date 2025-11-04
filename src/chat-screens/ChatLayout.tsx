import React, { useState } from "react";
import UsersList from "./UserList";
import ChatRoom from "./ChatRoom";
import chatPlaceholder from "../assets/image.png";

interface ChatLayoutProps {
  userId: string;
  onLogout: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ userId, onLogout }) => {
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-600">
      <div
        className={`${
          activeUserId ? "hidden md:block" : "block"
        } w-full md:w-1/3 bg-gray-300 border-r border-gray-600`}
      >
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">Chats</h2>
          <button
            onClick={onLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-100 hover:font-medium"
          >
            Logout
          </button>
        </div>

        <div
          className="overflow-y-auto bg-gray-300"
          style={{
            height: "calc(100vh - 64px)",
          }}
        >
          <UsersList
            userId={userId}
            onLogout={onLogout}
            onSelectUser={(id) => setActiveUserId(id)}
          />
        </div>
      </div>

      <div
        className={`${
          activeUserId ? "flex" : "hidden md:flex"
        } flex-1 bg-gray-300 flex-col relative`}
      >
        {activeUserId ? (
          <ChatRoom
            userId={userId}
            receiverId={activeUserId}
            onBack={() => setActiveUserId(null)}
          />
        ) : (
          <div className="flex flex-col justify-center items-center h-full text-gray-500">
            <img
              src={chatPlaceholder}
              alt="Chat Placeholder"
              className="mb-4 opacity-70 hidden md:block"
              style={{ width: '60%', maxWidth: '500px', height: 'auto' }}
            />
            <p className="text-lg text-center"> 
              Select a user to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatLayout;