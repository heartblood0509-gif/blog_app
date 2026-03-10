"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getSupabaseClient } from "@/lib/supabase";
import type { BlogProject } from "@/types";
import { History, Search, Trash2, ExternalLink, FileText } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  draft: { label: "임시저장", variant: "secondary" },
  analyzing: { label: "분석 중", variant: "outline" },
  analyzed: { label: "분석 완료", variant: "default" },
  generating: { label: "생성 중", variant: "outline" },
  completed: { label: "완료", variant: "default" },
  error: { label: "오류", variant: "destructive" },
};

export default function HistoryPage() {
  const [projects, setProjects] = useState<BlogProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase가 설정되지 않았습니다. .env.local 파일을 확인해주세요.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: dbError } = await supabase
        .from("blog_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      setProjects(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "프로젝트를 불러올 수 없습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("이 프로젝트를 삭제하시겠습니까?")) return;

    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await supabase.from("blog_projects").delete().eq("id", id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.topic?.toLowerCase().includes(q) ||
      p.keywords?.toLowerCase().includes(q) ||
      p.reference_url?.toLowerCase().includes(q) ||
      p.title?.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6" />
          프로젝트 히스토리
        </h1>
        <Badge variant="secondary">{projects.length}개</Badge>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="주제, 키워드, URL로 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-6 text-center text-destructive">
            <p>{error}</p>
            <p className="text-sm mt-2 text-muted-foreground">
              Supabase 연동이 필요합니다. 환경변수를 설정하고 테이블을 생성해주세요.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">
              {searchQuery ? "검색 결과가 없습니다" : "아직 프로젝트가 없습니다"}
            </p>
            <p className="text-sm mt-1">
              {searchQuery
                ? "다른 검색어를 시도해보세요"
                : "메인 페이지에서 블로그 글을 생성해보세요"}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {filteredProjects.map((project) => {
          const status = STATUS_LABELS[project.status] || STATUS_LABELS.draft;
          return (
            <Card key={project.id} className="hover:bg-muted/30 transition-colors">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {project.title || project.topic || "제목 없음"}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      {project.keywords && (
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {project.keywords}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    {project.reference_url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        render={
                          <a
                            href={project.reference_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                {project.generated_content && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {project.generated_content.slice(0, 200)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDate(project.created_at)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
