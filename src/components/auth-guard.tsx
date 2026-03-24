"use client";

import { useSession } from "next-auth/react";
import { appConfig } from "@/config/app-config";
import { LoginScreen } from "./login-screen";
import { PendingScreen } from "./pending-screen";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Company mode: no auth needed
  if (!appConfig.isUser) return <>{children}</>;

  // Loading
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return <LoginScreen />;
  }

  // Admin bypasses approval
  if ((session as any).isAdmin) {
    return <>{children}</>;
  }

  // Check user status
  const userStatus = (session as any).userStatus;

  if (userStatus === "revoked") {
    return (
      <PendingScreen status="revoked" email={session.user?.email || ""} />
    );
  }

  if (userStatus !== "active") {
    return (
      <PendingScreen status="pending" email={session.user?.email || ""} />
    );
  }

  return <>{children}</>;
}
