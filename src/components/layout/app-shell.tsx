import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";

interface AppShellProps {
  children: ReactNode;
  mainId?: string;
}

export function AppShell({ children, mainId }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 md:pb-0">
      {mainId && (
        <a
          href={`#${mainId}`}
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-4 focus:z-[60] focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:outline focus:outline-2 focus:outline-primary"
        >
          Lewati ke konten utama
        </a>
      )}
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <BottomNav />
    </div>
  );
}

export default AppShell;
