"use client";

import { useState } from "react";
import { Bell, Search, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatState } from "@/Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import SearchLoading from "./search/SearchLoading";
import SearchUserItem from "./search/SearchUserItem";

export const NavBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();

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
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xl font-bold text-purple-400">MERN Chat App</div>

        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
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
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {showSearchResults && loading && <SearchLoading />}

          {showSearchResults && searchResults.length > 0 && !loading && (
            <div className="absolute z-10 mt-1 w-full bg-gray-700 rounded-md shadow-lg max-h-80 overflow-auto space-y-4 p-2">
              {searchResults.map((user) => (
                <SearchUserItem
                  key={user._id}
                  user={user}
                  handleClick={() => accessChat(user._id)}
                />
              ))}
            </div>
          )}

          {showSearchResults && searchResults.length === 0 && !loading && (
            <div
              className="absolute z-10 mt-1 w-full bg-gray-700 rounded-md shadow-lg p-2 text-center text-white"
              onClick={() => setShowSearchResults(false)}
            >
              No users found
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:bg-gray-700"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-700 text-white border-gray-600"
            >
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem className="hover:bg-gray-600 focus:bg-gray-600">
                New message from Jane
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-600 focus:bg-gray-600">
                Bob added you to Tech Group
              </DropdownMenuItem>
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

          {/* Profile Modal */}
          <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
            <DialogContent className="bg-gray-800 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-xl text-white">
                  My Profile
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Your personal information
                </DialogDescription>
              </DialogHeader>
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4 text-gray-400" />
                <span className="sr-only">Close</span>
              </DialogClose>

              <div className="flex flex-col items-center py-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={user.pic || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
                <p className="text-gray-400">{user.email}</p>
              </div>

              <div className="flex justify-end mt-4">
                <Button className="bg-purple-600 hover:bg-purple-700 mr-2">
                  Edit Profile
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={logOutHandler}
                >
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
