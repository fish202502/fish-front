import { createContext } from "react";

const UrlContext = createContext({
  chatName : "",
  setChatName : (name)=>{},
});

export default UrlContext;