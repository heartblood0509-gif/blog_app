"use client";

import { useState, useCallback } from "react";
import { ReferencePanel } from "@/components/project/reference-panel";
import { GenerationPanel } from "@/components/project/generation-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Wand2 } from "lucide-react";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState("");
  const [referenceText, setReferenceText] = useState("");
  const [isAnalysisReady, setIsAnalysisReady] = useState(false);

  const handleAnalysisComplete = useCallback(
    (analysis: string, refText: string) => {
      setAnalysisResult(analysis);
      setReferenceText(refText);
      setIsAnalysisReady(true);
    },
    []
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Desktop: side-by-side panels */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6">
        <ReferencePanel onAnalysisComplete={handleAnalysisComplete} />
        <GenerationPanel
          analysisResult={analysisResult}
          referenceText={referenceText}
          isAnalysisReady={isAnalysisReady}
        />
      </div>

      {/* Mobile/Tablet: tabbed layout */}
      <div className="lg:hidden">
        <Tabs defaultValue="reference">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="reference" className="gap-1.5">
              <BookOpen className="h-4 w-4" />
              레퍼런스
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-1.5">
              <Wand2 className="h-4 w-4" />
              글 생성
              {isAnalysisReady && (
                <span className="ml-1 h-2 w-2 rounded-full bg-green-500" />
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reference" className="mt-4">
            <ReferencePanel onAnalysisComplete={handleAnalysisComplete} />
          </TabsContent>
          <TabsContent value="generate" className="mt-4">
            <GenerationPanel
              analysisResult={analysisResult}
              referenceText={referenceText}
              isAnalysisReady={isAnalysisReady}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
