import { ReactNode } from "react";
import Sidebar from "./sidebar";
import TopBar from "./topbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <TopBar />
        <div className="h-full overflow-auto p-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
