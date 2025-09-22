import React from "react";
import AppHeader from "./components/layouts/AppHeader";
import AppFooter from "./components/layouts/AppFooter";

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