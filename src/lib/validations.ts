import { z } from "zod";

export const crawlSchema = z.object({
  url: z.string().url("유효한 URL을 입력해주세요."),
});

export const analyzeSchema = z.object({
  referenceText: z
    .string()
    .min(50, "분석할 텍스트는 최소 50자 이상이어야 합니다."),
  projectId: z.string().optional(),
});

export const generateSchema = z.object({
  analysisResult: z.string().min(1, "분석 결과가 필요합니다."),
  referenceText: z.string().min(1, "레퍼런스 텍스트가 필요합니다."),
  topic: z.string().min(1, "주제를 입력해주세요."),
  keywords: z.string().min(1, "키워드를 입력해주세요."),
  requirements: z.string().optional(),
  projectId: z.string().optional(),
});
