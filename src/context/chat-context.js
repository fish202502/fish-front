import { createContext } from "react";

const ChatName = createContext({
  name : "",
  setName : (name)=>{},
  mySessionId:[],
});

export default ChatName;