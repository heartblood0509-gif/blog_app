import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim()).filter(Boolean);

async function checkAdmin(): Promise<boolean> {
  try {
    const session = await auth();
    return !!session?.user?.email && ADMIN_EMAILS.includes(session.user.email);
  } catch {
    return false;
  }
}

// GET /api/admin/users - 전체 사용자 목록 조회
export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json({ error: "Apps Script URL이 설정되지 않았습니다." }, { status: 500 });
  }

  try {
    const res = await fetch(`${scriptUrl}?action=listUsers`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "사용자 목록을 불러오지 못했습니다." }, { status: 500 });
  }
}

// PATCH /api/admin/users - 사용자 상태 변경
export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return NextResponse.json({ error: "Apps Script URL이 설정되지 않았습니다." }, { status: 500 });
  }

  try {
    const { email, status } = await request.json();
    if (!email || !["active", "pending", "revoked"].includes(status)) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const res = await fetch(
      `${scriptUrl}?action=updateStatus&email=${encodeURIComponent(email)}&status=${encodeURIComponent(status)}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "상태 변경에 실패했습니다." }, { status: 500 });
  }
}
