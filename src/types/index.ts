export interface BlogProject {
  id: string;
  created_at: string;
  updated_at: string;
  reference_url: string | null;
  reference_text: string | null;
  analysis_result: string | null;
  topic: string | null;
  keywords: string | null;
  requirements: string | null;
  generated_content: string | null;
  status: ProjectStatus;
  tags: string[] | null;
  title: string | null;
}

export type ProjectStatus =
  | "draft"
  | "analyzing"
  | "analyzed"
  | "generating"
  | "completed"
  | "error";

export interface CrawlResult {
  title: string;
  content: string;
  platform: string;
}

export interface CrawlRequest {
  url: string;
}

export interface AnalyzeRequest {
  referenceText: string;
  projectId?: string;
}

export interface GenerateRequest {
  analysisResult: string;
  referenceText: string;
  topic: string;
  keywords: string;
  requirements?: string;
  projectId?: string;
}
