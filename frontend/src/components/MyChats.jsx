"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatState } from "@/Context/ChatProvider";
import axios from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import ChatLoading from "./chats/ChatLoading";
import { getSenderName, getSenderImage } from "@/Helper/ChatHelper";
import CreateGroupChatModal from "./chats/CreateGroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const { user, chats, setChats, selectedChat, setSelectedChat, messages } =
    ChatState();

  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const [loggedUser, setLoggedUser] = useState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast.error("Failed to Load the Chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const getLastMessage = (chat) => {
    if (!chat.lastMessage) return "No messages yet";

    const lastMsg = messages.find((m) => m._id === chat.lastMessage);
    if (!lastMsg) return "No messages yet";

    const isSender = lastMsg.sender === user._id;
    const prefix = isSender ? "You: " : "";

    return `${prefix}${
      lastMsg.content.length > 20
        ? lastMsg.content.substring(0, 20) + "..."
        : lastMsg.content
    }`;
  };

  const getChatName = (chat) => {
    if (chat.isGroupChat) return chat.chatName;
    // In a real app, you would get the other user's name
    return chat.chatName;
  };

  return (
    <div
      className={`w-full md:w-1/3 border-r border-gray-700 bg-gray-800 p-4 md:flex flex-col h-full ${
        selectedChat ? "hidden" : "flex"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">My Chats</h2>
        <Button
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowCreateGroup(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> New Group
        </Button>
      </div>

      {chats ? (
        <div className="overflow-y-auto flex-1">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                selectedChat && selectedChat._id === chat._id
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={`${
                      !chat.isGroupChat
                        ? getSenderImage(loggedUser, chat.users)
                        : "/placeholder.svg?height=40&width=40"
                    }`}
                  />
                  <AvatarFallback>{getChatName(chat).charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-white">
                    {!chat.isGroupChat
                      ? getSenderName(loggedUser, chat.users)
                      : chat.chatName}
                    {/* {getChatName(chat)} */}
                  </p>
                  {chat.lastMessage && (
                    <p className="text-sm text-gray-400 truncate">
                      {chat.lastMessage.sender.name}: {chat.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ChatLoading />
      )}

      {/* Create Group Chat */}
      <CreateGroupChatModal
        showCreateGroup={showCreateGroup}
        setShowCreateGroup={setShowCreateGroup}
      />
    </div>
  );
};

export default MyChats;
