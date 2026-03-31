"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { ApiKeySettings } from "@/components/api-key-settings";
import { appConfig } from "@/config/app-config";
import { PenLine, History, LogOut, Shield, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLatestVersion } from "@/lib/updates";

const SEEN_VERSION_KEY = "blogpick-seen-version";

export function Header() {
  const { data: session } = useSession();
  const isAdmin = !!(session as any)?.isAdmin;
  const [hasNewUpdate, setHasNewUpdate] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(SEEN_VERSION_KEY);
    const latest = getLatestVersion();
    if (seen !== latest) {
      setHasNewUpdate(true);
    }
  }, []);

  const handleUpdateClick = () => {
    localStorage.setItem(SEEN_VERSION_KEY, getLatestVersion());
    setHasNewUpdate(false);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight">
          <PenLine className="h-6 w-6 text-primary" />
          <span>Blog Pick</span>
        </a>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/updates" />}
            className="relative flex items-center gap-1.5"
            onClick={handleUpdateClick}
          >
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">새소식</span>
            {hasNewUpdate && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            )}
          </Button>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/history" />} className="flex items-center gap-1.5">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">히스토리</span>
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/admin" />} className="flex items-center gap-1.5">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">관리</span>
            </Button>
          )}
          <ApiKeySettings />
          <ThemeToggle />
          {appConfig.isUser && session?.user && (
            <>
              <span className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[150px]">
                {session.user.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                title="로그아웃"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
