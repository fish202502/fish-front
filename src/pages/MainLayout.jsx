import { NavLink, useRouteLoaderData } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import { createContext, useContext } from "react";

const PermissionContext = createContext(null);

const MainNavigation = () => {
  const permissionData = useRouteLoaderData("room");

  return (
    <>
      <PermissionContext.Provider value={permissionData}>
        <Header />
        <Outlet/> 
      </PermissionContext.Provider>
    </>
  );
};

export const usePermission = () => useContext(PermissionContext);

export default MainNavigation;
