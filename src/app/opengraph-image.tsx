import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Blog Pick - 블로그 & 쓰레드 자동 생성";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)",
          position: "relative",
        }}
      >
        {/* 로고 아이콘 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.15)",
            marginBottom: "40px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
          </svg>
        </div>

        {/* 타이틀 */}
        <span
          style={{
            fontSize: "80px",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-2px",
            marginBottom: "16px",
          }}
        >
          Blog Pick
        </span>

        {/* 설명 */}
        <span
          style={{
            fontSize: "32px",
            color: "rgba(255,255,255,0.8)",
            fontWeight: 400,
          }}
        >
          블로그 & 쓰레드 자동 생성
        </span>

        {/* 하단 URL */}
        <span
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "20px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "1px",
          }}
        >
          blogpick.vercel.app
        </span>
      </div>
    ),
    { ...size }
  );
}
