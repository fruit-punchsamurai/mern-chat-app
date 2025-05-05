import { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { NavBar } from "@/components/NavBar";
import MyChats from "@/components/MyChats";
import { Toaster } from "sonner";
import ChatBox from "@/components/ChatBox";

const Chatpage = () => {
  const { user } = ChatState();

  const [fetchAgain, setFetchAgain] = useState(false);

  if (!user) return <div>Loading...</div>;
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Toaster position="top-right" richColors closeButton />
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default Chatpage;
