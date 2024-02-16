import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterContext from "./context/ToasterContext";
import { AuthContext } from "./context/AuthContext";
import LoadingModal from "./components/LoadingModal";
import ActiveList from "./components/ActiveList";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "massage-app",
  description: "message-app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ActiveList>
            <LoadingModal>
              <ToasterContext />
              {children}
            </LoadingModal>
          </ActiveList>
        </AuthContext>
      </body>
    </html>
  );
}
