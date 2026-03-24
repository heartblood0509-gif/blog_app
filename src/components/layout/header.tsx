"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./theme-toggle";
import { ApiKeySettings } from "@/components/api-key-settings";
import { appConfig } from "@/config/app-config";
import { PenLine, History, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();
  const isAdmin = !!(session as any)?.isAdmin;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight">
          <PenLine className="h-6 w-6 text-primary" />
          <span>Blog Pick</span>
        </a>

        <div className="flex items-center gap-2">
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
