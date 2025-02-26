import React, { useEffect, useState } from "react";
import ChatNameContext from "./chat-context";

const ChatNameProvider = ({ children }) => {
  const [chatName, setChatName] = useState(() => {
    const storedName = sessionStorage.getItem("chatName");
    return storedName ? JSON.parse(storedName) : null;
  });

  const [mySessionIds, setMySessionIds] = useState(() => {
    const storedIds = sessionStorage.getItem("mySessionIds");
    return storedIds ? JSON.parse(storedIds) : [];
  });

  useEffect(() => {
    if (chatName) {
      sessionStorage.setItem("chatName", JSON.stringify(chatName));
    }
  }, [chatName]);

  useEffect(() => {
    sessionStorage.setItem("mySessionIds", JSON.stringify(mySessionIds));
  }, [mySessionIds]);

  return (
    <ChatNameContext.Provider value={{ chatName, setChatName, mySessionIds, setMySessionIds }}>
      {children}
    </ChatNameContext.Provider>
  );
};

export default ChatNameProvider;
