import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import { X, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { ChatState } from "@/Context/ChatProvider";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import SearchUserItem from "../search/SearchUserItem";
import SearchLoading from "../search/SearchLoading";
import UserBadge from "./UserBadge";

const UpdateGroupChatModal = ({
  showUpdateGroupChat,
  setShowUpdateGroupChat,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [addRemoveLoading, setAddRemoveLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent default form behavior
  //   if (
  //     !groupCreateData.groupChatName.trim() ||
  //     groupCreateData.selectedUsers.length === 0
  //   ) {
  //     toast.error("Please fill all the fields");
  //     return;
  //   }

  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };

  //     const { data } = await axios.post(
  //       "/api/chat/creategroup",
  //       {
  //         name: groupCreateData.groupChatName,
  //         users: JSON.stringify(
  //           groupCreateData.selectedUsers.map((u) => u._id)
  //         ),
  //       },
  //       config
  //     );

  //     setChats([data, ...chats]);
  //     setShowCreateGroup(false);
  //     toast.success("New Group Chat Created");
  //   } catch (error) {
  //     toast.error("Failed to Create the Chat!");
  //   }
  // };

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

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.some((u) => u._id === userToAdd._id)) {
      toast("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast("Only admins can add someone!");
      return;
    }

    try {
      setAddRemoveLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/addtogroup",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setAddRemoveLoading(false);
    } catch (error) {
      toast.error("Error Occured!");
      setAddRemoveLoading(false);
    }
  };

  const handleRemoveUser = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast("Only admins can remove someone!");
      return;
    }

    try {
      setAddRemoveLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/removefromgroup",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );
      if (userToRemove._id === user._id) {
        setSelectedChat(null);
        setGroupChatName("");
        setSearchResults([]);
      } else {
        setSelectedChat(data);
      }

      setFetchAgain(!fetchAgain);
      fetchMessages();
      setAddRemoveLoading(false);
    } catch (error) {
      toast.error("Error Occured!");
      setAddRemoveLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName.trim()) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/renamegroup",
        {
          chatId: selectedChat._id,
          chatName: groupChatName.trim(),
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error("Error Occured!");
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  return (
    <Dialog
      open={showUpdateGroupChat}
      onOpenChange={(isOpen) => {
        setShowUpdateGroupChat(isOpen);
        if (!isOpen) {
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
            {selectedChat.chatName}
          </DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4 text-gray-400" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Existing users */}

        <div className="flex flex-wrap gap-2 mt-2">
          {selectedChat.users.map((user) => (
            <UserBadge key={user._id} user={user} onRemove={handleRemoveUser} />
          ))}
        </div>

        <div className="flex space-x-2">
          <Input
            type="text"
            name="updateGroupChatName"
            placeholder="Chat Name"
            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <Button
            className="bg-teal-600 hover:bg-teal-700 p-2"
            onClick={handleRename}
          >
            {renameLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Update"
            )}
          </Button>
        </div>
        <div>
          <Input
            type="text"
            placeholder="Add Users..."
            className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            onChange={(e) => handleSearch(e.target.value)}
          />

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
        {addRemoveLoading && <Loader2 className="h-6 w-6 animate-spin" />}

        <div className="flex justify-end pt-2">
          <Button
            className="bg-rose-600 hover:bg-rose-700 p-2"
            onClick={() => handleRemoveUser(user)}
          >
            Leave Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateGroupChatModal;
