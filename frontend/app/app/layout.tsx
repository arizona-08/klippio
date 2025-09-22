import React from "react";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>){
  return (
    <>
      <AppHeader />
        {children}
      <AppFooter />
    </>
  )
}