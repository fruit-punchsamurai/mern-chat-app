import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!selectedChat) return;

    setNotification((prevNotifications) =>
      prevNotifications.filter((notif) => notif.chat._id !== selectedChat._id)
    );
  }, [selectedChat]);
  return (
    <chatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(chatContext);
};

export default ChatProvider;
