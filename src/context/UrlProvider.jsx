import React, { useEffect, useState } from "react";
import ChatNameContext from "./chat-context";
import UrlContext from "./url-context";

const UrlProvider = ({ children }) => {
  const [urlData, setUrlData] = useState({
    roomCode: "",
    readUrl: "",
    writeUrl: "",
  });

  return (
    <UrlContext.Provider value={{ urlData ,setUrlData}}>
      {children}
    </UrlContext.Provider>
  );
};

export default UrlProvider;
