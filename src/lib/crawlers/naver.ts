import type { CrawlResult } from "@/types";

export async function crawlNaver(url: string): Promise<CrawlResult> {
  const { chromium } = await import("playwright");

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Naver blog loads content inside an iframe
    let title = "";
    let content = "";

    // Try to find the main iframe
    const iframeElement = await page.$("iframe#mainFrame");
    if (iframeElement) {
      const frame = await iframeElement.contentFrame();
      if (frame) {
        // Wait for content to load
        await frame
          .waitForSelector(
            ".se-main-container, #postViewArea, .se_component_wrap",
            { timeout: 10000 }
          )
          .catch(() => {});

        // Extract title
        title = await frame
          .evaluate(() => {
            const selectors = [
              ".se-title-text",
              ".pcol1 .itemSubjectBoldfont",
              ".se_title .se_textView",
              "h3.se_textarea",
            ];
            for (const sel of selectors) {
              const el = document.querySelector(sel);
              if (el?.textContent?.trim()) return el.textContent.trim();
            }
            return "";
          })
          .catch(() => "");

        // Extract content
        content = await frame
          .evaluate(() => {
            const selectors = [
              ".se-main-container",
              "#postViewArea",
              ".se_component_wrap",
            ];

            for (const sel of selectors) {
              const el = document.querySelector(sel);
              if (el) {
                // Remove unwanted elements
                el.querySelectorAll(
                  "script, style, .se-oglink-container"
                ).forEach((e) => e.remove());

                const blocks: string[] = [];
                el.querySelectorAll(
                  "p, h2, h3, h4, span.se-text-paragraph, div.se-text-paragraph"
                ).forEach((child) => {
                  const text = (child.textContent || "").trim();
                  if (!text) return;

                  const tag = child.tagName?.toLowerCase();
                  if (tag?.startsWith("h")) {
                    const level = parseInt(tag[1]);
                    blocks.push("#".repeat(level) + " " + text);
                  } else if (text.length > 2) {
                    blocks.push(text);
                  }
                });

                const result = blocks.join("\n\n");
                if (result.length > 100) return result;
              }
            }
            return "";
          })
          .catch(() => "");
      }
    }

    // Fallback for mobile Naver blog or non-iframe pages
    if (!content) {
      title = await page
        .evaluate(() => {
          const el =
            document.querySelector("h3.se_textarea") ||
            document.querySelector(".tit_h3") ||
            document.querySelector("h2");
          return el?.textContent?.trim() || document.title;
        })
        .catch(() => "");

      content = await page
        .evaluate(() => {
          const el =
            document.querySelector(".post_ct") ||
            document.querySelector(".se_component_wrap") ||
            document.querySelector("article");
          if (el) {
            el.querySelectorAll("script, style").forEach((e) => e.remove());
            return el.textContent?.trim() || "";
          }
          return "";
        })
        .catch(() => "");
    }

    if (!content) {
      throw new Error("네이버 블로그에서 콘텐츠를 추출할 수 없습니다.");
    }

    return { title, content, platform: "naver" };
  } finally {
    await browser.close();
  }
}
