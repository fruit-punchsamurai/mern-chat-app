import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import { X } from "lucide-react";
import { Input } from "../ui/input";
import { ChatState } from "@/Context/ChatProvider";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import SearchUserItem from "../search/SearchUserItem";
import SearchLoading from "../search/SearchLoading";
import UserBadge from "./UserBadge";

const CreateGroupChatModal = ({ showCreateGroup, setShowCreateGroup }) => {
  const { user, chats, setChats } = ChatState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupCreateData, setGroupCreateData] = useState({
    groupChatName: "",
    selectedUsers: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    if (
      !groupCreateData.groupChatName.trim() ||
      groupCreateData.selectedUsers.length === 0
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/creategroup",
        {
          name: groupCreateData.groupChatName,
          users: JSON.stringify(
            groupCreateData.selectedUsers.map((u) => u._id)
          ),
        },
        config
      );

      setChats([data, ...chats]);
      setGroupCreateData({
        groupChatName: "",
        selectedUsers: [],
      });
      setSearchResults([]);
      setShowCreateGroup(false);
      toast.success("New Group Chat Created");
    } catch (error) {
      toast.error("Failed to Create the Chat!");
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results");
    }
  };

  const handleAddUser = (userToAdd) => {
    if (groupCreateData.selectedUsers.some((u) => u._id === userToAdd._id)) {
      toast("User Already Added");
      return;
    }

    setGroupCreateData((prev) => ({
      ...prev,
      selectedUsers: [...prev.selectedUsers, userToAdd],
    }));
  };

  const handleRemoveUser = (userToRemove) => {
    setGroupCreateData((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.filter(
        (u) => u._id !== userToRemove._id
      ),
    }));
  };

  return (
    <Dialog
      open={showCreateGroup}
      onOpenChange={(isOpen) => {
        setShowCreateGroup(isOpen);
        if (!isOpen) {
          setGroupCreateData({
            groupChatName: "",
            selectedUsers: [],
          });
          setSearchResults([]);
        }
      }}
    >
      <DialogContent
        className="bg-gray-800 text-white border-gray-700 max-h-[90vh] overflow-y-auto top-[20%] translate-y-0"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="text-3xl text-white">
            Create Group Chat
          </DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4 text-gray-400" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="groupChatName"
            placeholder="Chat Name"
            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            onChange={(e) =>
              setGroupCreateData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />

          <div>
            <Input
              type="text"
              placeholder="Add Users..."
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              onChange={(e) => handleSearch(e.target.value)}
            />

            {/* Selected users can go here */}
            {groupCreateData.selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {groupCreateData.selectedUsers.map((user) => (
                  <UserBadge
                    key={user._id}
                    user={user}
                    onRemove={handleRemoveUser}
                  />
                ))}
              </div>
            )}

            {/* Search results dropdown */}
            {(loading || searchResults.length > 0) && (
              <div className="mt-2 bg-gray-700 rounded-md shadow-inner max-h-80 overflow-auto space-y-2 p-2">
                {loading ? (
                  <SearchLoading />
                ) : (
                  searchResults.map((user) => (
                    <SearchUserItem
                      key={user._id}
                      user={user}
                      handleClick={() => handleAddUser(user)}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button className="bg-purple-600 hover:bg-purple-700" type="submit">
              Create Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupChatModal;
