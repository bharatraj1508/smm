"use client";

import { useState } from "react";

import DOMPurify from "dompurify";
import { LucideSparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSummarizeEmail } from "@/services/ai";
import { useGetMailbyId } from "@/services/gmail";

import ViewMailSkeleton from "./ViewMailSkeleton";

type ViewMailProps = {
  id: string;
};

function cleanEmailHTML(rawHTML: string) {
  if (!rawHTML) return "";

  // Find the start of HTML document
  const htmlIndex = rawHTML.search(/<\s*(?:!DOCTYPE|html)/i);
  if (htmlIndex > 0) {
    rawHTML = rawHTML.slice(htmlIndex);
  }

  const sanitized = DOMPurify.sanitize(rawHTML, {
    USE_PROFILES: { html: true },
  });

  return sanitized;
}

// function extractPlainText(rawHTML: string): string {
//   if (!rawHTML) return "";
//   const htmlIndex = rawHTML.search(/<\s*(?:!DOCTYPE|html)/i);
//   const beforeHTML = rawHTML.slice(0, htmlIndex);
//   return beforeHTML;
// }

export default function ViewMail({ id }: ViewMailProps) {
  const { data: mail, isPending } = useGetMailbyId(id);
  const [summary, setSummary] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const { mutateAsync: summarizeEmail, isPending: isRequestPending } =
    useSummarizeEmail();

  const handleSummarize = async () => {
    try {
      setIsStreaming(true);
      setSummary("");
      const reader = await summarizeEmail(id);
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setSummary((prev) => prev + chunk);
      }
    } catch (error) {
      console.error("Failed to stream summary", error);
    } finally {
      setIsStreaming(false);
    }
  };

  if (isPending) return <ViewMailSkeleton />;


  const safeHTML = cleanEmailHTML(mail?.data.body || "");

  return (
    <div className="flex justify-center items-center w-[80vw] mt-10">
      <div className="w-full max-w-3xl max-h-[80dvh] border border-gray-200 rounded-xl bg-white shadow-lg p-8 overflow-auto">
        <div className="flex items-start w-full gap-3">
          <Image
            width="52"
            height="52"
            src="/avatar.png"
            alt="support"
            className="w-13 h-13 rounded-full"
          />
          <div className="flex items-start justify-center flex-col gap-4 w-full">
            <div className="w-full flex justify-between items-center">
              <div className="flex flex-col items-start justify-center text-sm mt-1.5">
                <div>
                  <span className="font-bold">
                    {mail?.data.from?.match(/^(.*?)</)?.[1]?.trim() ||
                      mail?.data.from}
                  </span>
                  <span className="font-medium text-neutral-400">
                    &lt;{mail?.data.from?.match(/<(.*?)>/)?.[1] || ""}&gt;
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium text-neutral-400">
                    to {mail?.data.to.join(", ")}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleSummarize}
                disabled={isStreaming || isRequestPending}
                className="border border-gray-200 rounded-lg px-3 py-1.5 bg-gradient-to-r from-purple-800 to-purple-400 text-white font-bold text-sm hover:opacity-90 disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-1">
                  {isStreaming || isRequestPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <LucideSparkles className="w-5 h-5" />
                  )}
                  {isStreaming || isRequestPending
                    ? "Summarizing..."
                    : "Summarize"}
                </span>
              </Button>
            </div>

            <div className="flex flex-col justify-center gap-2">
              <Badge variant="secondary" className="bg-amber-400 w-fit">
                {mail?.data.category.type.split("_").join(" ")}
              </Badge>
              <p className="text-xs font-thin">{mail?.data.category.reason}</p>
            </div>

            {(summary || isStreaming) && (
              <div className="w-full bg-purple-50/50 p-6 rounded-xl border border-purple-100 mb-8 transition-all animate-in fade-in slide-in-from-top-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100/50 rounded-lg">
                    <LucideSparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-purple-900 font-bold text-lg">
                    AI Insights & Summary
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed
                  prose-headings:text-purple-900 prose-headings:font-bold prose-headings:mt-4 prose-headings:mb-2
                  prose-p:mb-3 prose-li:mb-1 prose-strong:text-purple-800 prose-ul:my-2 prose-ol:my-2">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                  {isStreaming && (
                    <span className="inline-block w-2 h-4 ml-1 bg-purple-400 animate-pulse align-middle rounded-sm" />
                  )}
                </div>
              </div>
            )}

            {mail?.data.subject && (
              <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                {mail.data.subject}
              </h1>
            )}
            <div
              className="prose prose-slate max-w-none
          prose-img:rounded-lg
          prose-a:text-blue-600
          prose-a:underline
          prose-headings:mb-2
          prose-p:my-1
          prose-table:border
          prose-blockquote:border-l-4
          prose-blockquote:border-blue-300
          prose-blockquote:pl-4
          prose-blockquote:text-gray-600"
              dangerouslySetInnerHTML={{ __html: safeHTML }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
