"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Info,
  ArrowLeft,
  Settings,
  UserRound,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatState } from "@/Context/ChatProvider";
import {
  getSenderName,
  getSender,
  getSenderImage,
  isSameSender,
  isLastMessage,
} from "@/Helper/ChatHelper";
import SenderProfileModal from "./chats/SenderProfileModal";
import UpdateGroupChatModal from "./chats/UpdateGroupChatModal";
import { toast } from "sonner";
import axios from "axios";
import { io } from "socket.io-client";
import { SOCKET_ENDPOINT } from "../config/index";

let socket, selectedChatCompare;

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    logOutUser,
  } = ChatState();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUpdateGroupChat, setShowUpdateGroupChat] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to Load the Messages"), setLoading(false);
    }
  };

  const addNotification = async (messageId) => {
    if (!user || !messageId) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/user/notification/add",
        { messageId },
        config
      );

      setNotification(data.notifications);
      return data;
    } catch (error) {
      console.error("Failed to add notification:", error);
      toast.error("Failed to add notification");
    }
  };

  const handleSend = async () => {
    if (newMessage.trim()) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain((prev) => !prev);
      } catch (error) {
        toast.error("Failed to send the Message");
        setNewMessage("");
      }
    }
  };

  useEffect(() => {
    socket = io(SOCKET_ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", (room) => {
      if (room === selectedChatCompare._id) {
        setIsTyping(true);
      }
    });

    socket.on("stop typing", (room) => {
      if (room === selectedChatCompare._id) {
        setIsTyping(false);
      }
    });
  }, [selectedChat]);

  useEffect(() => {
    if (logOutUser) {
      socket.disconnect();
    }
  }, [logOutUser]);

  useEffect(() => {
    if (!selectedChat) return;
    fetchMessages();
    selectedChatCompare = selectedChat;
    setTyping(false);
    setIsTyping(false);
    socket.emit("stop typing", selectedChat._id);
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", async (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          // setNotification([newMessageRecieved, ...notification]);
          setFetchAgain((prev) => !prev);
          await addNotification(newMessageRecieved._id);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
        setFetchAgain((prev) => !prev);
      }
    });

    return () => socket.off("message recieved");
  }, []);

  const handleType = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin h-12 w-12 text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4 flex flex-col justify-end h-full">
            {messages && messages.length > 0 ? (
              messages.map((message, index) => {
                const sameSender = isSameSender(
                  messages,
                  message,
                  index,
                  user._id
                );
                const finalMessage = isLastMessage(messages, index, user._id);
                const isOwnMessage = message.sender._id === user._id;

                return (
                  <div
                    key={message._id}
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex items-end gap-2 max-w-[70%]">
                      {/* Show avatar if sameSender or finalMessage and it's not own message */}
                      {sameSender || finalMessage ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender.pic} />
                          <AvatarFallback>
                            {message.sender.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8" /> // Placeholder to maintain alignment
                      )}

                      <div
                        className={`rounded-4xl px-3 py-2 ${
                          isOwnMessage
                            ? "bg-teal-600 text-white"
                            : "bg-gray-700 text-white border-gray-600"
                        }`}
                      >
                        <p>{message.content}</p>
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

            {isTyping ? (
              <div className="flex justify-start pl-10 mt-2">
                <div className="bg-gray-600 text-white text-sm py-4 px-4 rounded-3xl flex items-center space-x-1">
                  <span
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            ) : (
              <div className="h-[40px] mt-2" /> // same height as the typing indicator
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={handleType}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-teal-600 hover:bg-teal-700"
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
        fetchMessages={fetchMessages}
      />
    </div>
  );
};

export default ChatBox;
