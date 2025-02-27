import { NavLink, useRouteLoaderData } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import { createContext, useContext } from "react";
import UrlProvider from "../context/UrlProvider";
import ChatNameProvider from "../context/ChatNameProvider";

const PermissionContext = createContext(null);

const MainNavigation = () => {
  const permissionData = useRouteLoaderData("room");

  return (
    <>
      <PermissionContext.Provider value={permissionData}>
        <UrlProvider>
        <ChatNameProvider>
        <Header />
        <Outlet/> 
        </ChatNameProvider>
        </UrlProvider>
      </PermissionContext.Provider>
    </>
  );
};

export const usePermission = () => useContext(PermissionContext);

export default MainNavigation;
