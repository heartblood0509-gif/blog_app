import type { CrawlResult } from "@/types";
import { crawlNaver } from "./naver";
import { crawlTistory } from "./tistory";
import { crawlGeneral } from "./general";

export type Platform = "naver" | "tistory" | "general";

export function detectPlatform(url: string): Platform {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    if (
      hostname.includes("blog.naver.com") ||
      hostname.includes("m.blog.naver.com") ||
      hostname.includes("post.naver.com")
    ) {
      return "naver";
    }

    if (hostname.includes("tistory.com")) {
      return "tistory";
    }

    return "general";
  } catch {
    return "general";
  }
}

export async function crawlUrl(url: string): Promise<CrawlResult> {
  const platform = detectPlatform(url);

  switch (platform) {
    case "naver":
      return crawlNaver(url);
    case "tistory":
      return crawlTistory(url);
    case "general":
      return crawlGeneral(url);
  }
}
