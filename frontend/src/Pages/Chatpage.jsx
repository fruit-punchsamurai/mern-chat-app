import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { NavBar } from "@/components/NavBar";
import MyChats from "@/components/MyChats";
import { Toaster } from "sonner";
import ChatBox from "@/components/ChatBox";
const dummyUsers = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    pic: "https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg",
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    pic: "https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg",
  },
  {
    _id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    pic: "https://icon-library.com/images/default-profile-icon/default-profile-icon-6.jpg",
  },
];

const dummyChats = [
  {
    _id: "c1",
    chatName: "John Doe",
    isGroupChat: false,
    users: ["1", "2"],
    lastMessage: "m1",
  },
  {
    _id: "c2",
    chatName: "Tech Group",
    isGroupChat: true,
    users: ["1", "2", "3"],
    lastMessage: "m2",
    groupAdmin: "1",
  },
  {
    _id: "c3",
    chatName: "Bob Johnson",
    isGroupChat: false,
    users: ["1", "3"],
    lastMessage: "m3",
  },
];

const dummyMessages = [
  {
    _id: "m1",
    sender: "2",
    content: "Hey, how are you?",
    chat: "c1",
    createdAt: "2023-05-03T10:30:00Z",
  },
  {
    _id: "m2",
    sender: "3",
    content: "Meeting at 3pm tomorrow",
    chat: "c2",
    createdAt: "2023-05-03T11:45:00Z",
  },
  {
    _id: "m3",
    sender: "3",
    content: "Can you help me with the project?",
    chat: "c3",
    createdAt: "2023-05-03T09:15:00Z",
  },
];

const Chatpage = () => {
  const { user, setUser } = ChatState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState(dummyChats);
  const [messages, setMessages] = useState(dummyMessages);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [fetchAgain, setFetchAgain] = useState(false);

  const handleSearch = (query) => {
    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = dummyUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const accessChat = (userId) => {
    // // Find existing chat or create new one
    // const existingChat = chats.find(
    //   (c) =>
    //     !c.isGroupChat && c.users.includes(userId) && c.users.includes(user._id)
    // );

    // if (existingChat) {
    //   setSelectedChat(existingChat);
    // } else {
    //   // In a real app, you would create a new chat here
    //   const newChat = {
    //     _id: `c${chats.length + 1}`,
    //     chatName: dummyUsers.find((u) => u._id === userId).name,
    //     isGroupChat: false,
    //     users: [user._id, userId],
    //     lastMessage: null,
    //   };

    //   setChats([...chats, newChat]);
    //   setSelectedChat(newChat);
    // }

    setShowSearchResults(false);
  };

  const sendMessage = (content) => {
    if (!content.trim() || !selectedChat) return;

    const newMessage = {
      _id: `m${messages.length + 1}`,
      sender: user._id,
      content,
      chat: selectedChat._id,
      createdAt: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);

    // Update last message in chat
    const updatedChats = chats.map((c) =>
      c._id === selectedChat._id ? { ...c, lastMessage: newMessage._id } : c
    );

    setChats(updatedChats);
  };

  if (!user) return <div>Loading...</div>;
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Toaster position="top-right" richColors closeButton />
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <MyChats messages={messages} fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default Chatpage;
