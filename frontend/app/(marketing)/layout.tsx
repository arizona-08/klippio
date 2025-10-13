import AuthUserProvider from "../Context/AuthUserProvider";
import MarketingFooter from "./components/MarketingFooter";
import MarketingHeader from "./components/MarketingHeader";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthUserProvider>
        <MarketingHeader />
          {children}
        <MarketingFooter />
      </AuthUserProvider>
    </>
      
  );
}