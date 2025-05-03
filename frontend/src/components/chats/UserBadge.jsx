import React from "react";
import { X } from "lucide-react";
const UserBadge = ({ user, onRemove }) => {
  return (
    <div className="flex items-center gap-2 bg-purple-700 text-white px-3 py-1 rounded-full">
      <span>{user.name}</span>
      <button
        onClick={() => onRemove(user)}
        className="text-white hover:text-gray-300 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default UserBadge;
