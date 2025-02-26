import React, { useEffect, useState } from "react";
import ChatNameContext from "./chat-context";

const ChatNameProvider = ({ children }) => {
  const [chatName, setChatName] = useState(() => {
    const storedName = sessionStorage.getItem("chatName");
    return storedName ? JSON.parse(storedName) : null;
  });

  useEffect(() => {
    if (chatName) {
      sessionStorage.setItem("chatName", JSON.stringify(chatName));
    }
  }, [chatName]);

  return (
    <ChatNameContext.Provider value={{ chatName, setChatName }}>
      {children}
    </ChatNameContext.Provider>
  );
};

export default ChatNameProvider;
