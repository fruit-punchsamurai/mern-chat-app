import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [logOutUser, setLogOutUser] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/api/user/notification", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setNotification(data); // Store fetched notifications in state
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };

  const removeNotificationFromBackend = async (notificationId) => {
    try {
      const { data } = await axios.post(
        "/api/user/notification/remove",
        { notificationId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Update the notifications in state with the latest from backend
      setNotification(data);
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications(); // Fetch notifications when the user is logged in
    }
  }, [user]);

  useEffect(() => {
    if (!selectedChat) return;

    const notificationsToRemove = notification.filter(
      (notif) => notif.chat._id === selectedChat._id
    );
    notificationsToRemove.forEach((notif) => {
      removeNotificationFromBackend(notif._id);
    });

    // setNotification((prevNotifications) =>
    //   prevNotifications.filter((notif) => notif.chat._id !== selectedChat._id)
    // );
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
        removeNotificationFromBackend,
        logOutUser,
        setLogOutUser,
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
