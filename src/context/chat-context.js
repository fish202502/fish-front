import { createContext } from "react";

const ChatNameContext = createContext({
  chatName : "",
  setChatName : (name)=>{},
});

export default ChatNameContext;