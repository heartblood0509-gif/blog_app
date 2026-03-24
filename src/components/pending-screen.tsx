"use client";

import { signOut } from "next-auth/react";
import { PenLine, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendingScreenProps {
  status: "pending" | "revoked";
  email: string;
}

export function PendingScreen({ status, email }: PendingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8 max-w-sm">
        <div className="flex items-center justify-center gap-3">
          <PenLine className="h-10 w-10 text-primary" />
          <h1 className="text-3xl font-extrabold">Blog Pick</h1>
        </div>

        {status === "pending" ? (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">승인 대기 중</h2>
              <p className="text-muted-foreground">
                관리자가 승인할 때까지 기다려주세요.
                <br />
                승인 후 새로고침하면 사용할 수 있습니다.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">
                사용 권한이 해제되었습니다
              </h2>
              <p className="text-muted-foreground">
                문의가 필요하시면 관리자에게 연락해주세요.
              </p>
            </div>
          </>
        )}

        <p className="text-sm text-muted-foreground">{email}</p>

        <Button variant="outline" onClick={() => signOut()} className="gap-2">
          로그아웃
        </Button>
      </div>
    </div>
  );
}
