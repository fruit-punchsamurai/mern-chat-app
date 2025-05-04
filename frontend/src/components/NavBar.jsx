"use client";

import { useState } from "react";
import { Bell, Ghost, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatState } from "@/Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import SearchLoading from "./search/SearchLoading";
import SearchUserItem from "./search/SearchUserItem";
import { Loader2 } from "lucide-react";
import ProfileModal from "./search/ProfileModal";
import { getSenderName } from "@/Helper/ChatHelper";

export const NavBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${searchQuery}`,
        config
      );

      setLoading(false);
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (error) {
      toast.error("Failed to Load the Search Results");
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      setShowSearchResults(false);
    } catch (error) {
      toast.error(`Error Fetching the chat ${error.message}`);
      setShowSearchResults(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white shadow-md p-4">
      <div className="container flex flex-col gap-4 min-w-full md:flex-row items-center justify-between">
        {/* App name - visible only on desktop */}
        <div className="hidden md:block text-xl font-bold text-purple-400 md:mr-4">
          MERN Chat App
        </div>

        {/* Search bar - Same position in desktop and mobile (middle/second) */}
        <div className="w-full md:flex-1 md:mx-4 mb-4 md:mb-0 order-2">
          <div className="relative w-full md:max-w-5xl md:mx-auto">
            <div className="flex">
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button
                onClick={handleSearch}
                className="ml-2 bg-purple-600 hover:bg-purple-700"
              >
                {loadingChat ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {showSearchResults && (
              <div className="absolute z-10 mt-1 w-full">
                {loading && <SearchLoading />}

                {searchResults.length > 0 && !loading && (
                  <div className="bg-gray-700 rounded-md shadow-lg max-h-80 overflow-auto space-y-4 p-2">
                    {searchResults.map((user) => (
                      <SearchUserItem
                        key={user._id}
                        user={user}
                        handleClick={() => accessChat(user._id)}
                      />
                    ))}
                  </div>
                )}

                {searchResults.length === 0 && !loading && (
                  <div
                    className="bg-gray-700 rounded-md shadow-lg p-2 text-center text-white"
                    onClick={() => setShowSearchResults(false)}
                  >
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right section with app name (mobile only), notification and profile */}
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto order-1 md:order-3">
          {/* App name - visible only on mobile */}
          <div className="md:hidden text-xl font-bold text-purple-400">
            MERN Chat App
          </div>

          {/* Notification and Profile */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative text-white hover:bg-gray-700">
                  <Bell />
                  {notification && notification.length > 0 && (
                    <span className="absolute -top-3 -right-2 h-fit w-fit px-1.5 py-0.5 rounded-full bg-red-500 text-xs">
                      {notification.length}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-700 text-white border-gray-600"
              >
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600" />
                {notification && notification.length > 0 ? (
                  notification.map((notif) => (
                    <DropdownMenuItem
                      key={notif._id}
                      className="hover:bg-gray-600 focus:bg-gray-600"
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((n) => n !== notif)
                        );
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSenderName(
                            user,
                            notif.chat.users
                          )}`}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem className="hover:bg-gray-600 focus:bg-gray-600">
                    No new notifications
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-white hover:bg-gray-700"
              onClick={() => setShowProfileModal(true)}
            >
              <Avatar>
                <AvatarImage
                  src={user.pic || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{user.name}</span>
            </Button>
          </div>
        </div>

        {/* Profile Modal */}
        <ProfileModal
          showProfileModal={showProfileModal}
          setShowProfileModal={setShowProfileModal}
          logOutHandler={logOutHandler}
        />
      </div>
    </div>
  );
};
