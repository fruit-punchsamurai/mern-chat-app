"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Info, ArrowLeft, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatState } from "@/Context/ChatProvider";
import { getSenderName, getSender, getSenderImage } from "@/Helper/ChatHelper";
import SenderProfileModal from "./chats/SenderProfileModal";
import UpdateGroupChatModal from "./chats/UpdateGroupChatModal";

const ChatBox = ({ messages, sendMessage, fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUpdateGroupChat, setShowUpdateGroupChat] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!selectedChat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-900">
        <div className="text-center p-8">
          <Info className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">
            No chat selected
          </h3>
          <p className="text-gray-500">
            Select a chat from the sidebar or search for a user to start
            chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-900">
      {/* Chat header */}
      <div className="bg-gray-800 p-4 shadow-sm flex items-center border-b border-gray-700 text-white">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-white hover:bg-gray-700 md:hidden"
          onClick={() => {
            setSelectedChat(null);
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage
            src={`${
              !selectedChat.isGroupChat
                ? getSenderImage(user, selectedChat.users)
                : "/placeholder.svg?height=40&width=40"
            }`}
          />
          <AvatarFallback className="text-black">
            {selectedChat.chatName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          {selectedChat.isGroupChat ? (
            <h3 className="font-medium text-white">
              {selectedChat.chatName.toUpperCase()}
            </h3>
          ) : (
            <h3 className="font-medium text-white">
              {getSenderName(user, selectedChat.users).toUpperCase()}
            </h3>
          )}

          <p className="text-sm text-gray-400">
            {selectedChat.isGroupChat && `${selectedChat.users.length} members`}
          </p>
        </div>
        <div className="ml-auto">
          {selectedChat.isGroupChat ? (
            <Settings
              className="cursor-pointer h-10 w-10 p-2 rounded-full bg-gray-700/60 text-white hover:bg-gray-600 transition-colors shadow-sm"
              onClick={() => setShowUpdateGroupChat(true)}
            />
          ) : (
            <UserRound
              className="cursor-pointer h-10 w-10 p-2 rounded-full bg-gray-700/60 text-white hover:bg-gray-600 transition-colors shadow-sm"
              onClick={() => setShowProfileModal(true)}
            />
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => {
              const isOwnMessage = message.sender === user._id;

              return (
                <div
                  key={message._id}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-end gap-2 max-w-[70%]">
                    {!isOwnMessage && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        isOwnMessage
                          ? "bg-purple-600 text-white"
                          : "bg-gray-700 text-white border-gray-600"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p
                        className={`text-xs mt-1 text-right ${
                          isOwnMessage ? "text-purple-200" : "text-gray-400"
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 my-8">
              No messages yet. Start the conversation!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sender Profile Modal */}
      <SenderProfileModal
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
        user={getSender(user, selectedChat.users)}
      />

      <UpdateGroupChatModal
        showUpdateGroupChat={showUpdateGroupChat}
        setShowUpdateGroupChat={setShowUpdateGroupChat}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </div>
  );
};

export default ChatBox;
