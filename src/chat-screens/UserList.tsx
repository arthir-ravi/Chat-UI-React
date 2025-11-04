import React, { useEffect, useState } from "react";
import { api } from "../api/api";

interface UsersListProps {
  userId: string;
  onLogout: () => void;
  onSelectUser: (receiverId: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({ userId, onSelectUser }) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/user")
      .then((res) => {
        const allUsers = res.data.data || [];
        const filteredUsers = allUsers.filter((u: any) => u._id !== userId);
        setUsers(filteredUsers);
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  }, [userId]);

  return (
    <div className="p-2 sm:p-4 overflow-y-auto h-full max-h-[80vh]">
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user._id)}
          className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-blue-100 transition-all duration-200 border-b border-gray-100 sm:gap-4 sm:p-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-100 border border-blue-600 rounded-full flex items-center justify-center font-semibold text-blue-700 text-lg sm:text-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
            {user.name}
          </p>
        </div>
      ))}

      {users.length === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          No other users found.
        </p>
      )}
    </div>
  );
};

export default UsersList;