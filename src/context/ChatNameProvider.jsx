import React, { useEffect, useState } from "react";
import ChatNameContext from "./chat-context";

const ChatNameProvider = ({ children }) => {

  const [chatName, setChatName] = useState("");

  const [mySessionIds, setMySessionIds] = useState([]);

  return (
    <ChatNameContext.Provider value={
      { chatName, setChatName, 
        mySessionIds, setMySessionIds,
       }
      }>
      {children}
    </ChatNameContext.Provider>
  );
};

export default ChatNameProvider;
