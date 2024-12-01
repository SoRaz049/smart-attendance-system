"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode, useContext } from "react";
import AppSidebar from "../components/Sidebar";
import FullWidthWrapper from "../components/FullWidthWrapper";
import Navbar from "../components/Navbar";
import { AppContext } from "@/contexts/AppContexts";
import { redirect } from "next/navigation";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  // const { appData } = useContext(AppContext);
  // if (appData.isLoading) {
  //   return <div>Loading...</div>;
  // }
  // if (!appData.isLoading && !appData.user) {
  //   return redirect("/login");
  // }
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <Navbar />
          <FullWidthWrapper>{children}</FullWidthWrapper>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
