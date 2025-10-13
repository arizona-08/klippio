import React from "react";
import AppHeader from "./components/layouts/AppHeader";
import AppFooter from "./components/layouts/AppFooter";
import AuthUserProvider from "../Context/AuthUserProvider";

export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>){
  return (
    <>
      <AuthUserProvider>
        <AppHeader />
          {children}
        <AppFooter />
      </AuthUserProvider>
    </>
  )
}