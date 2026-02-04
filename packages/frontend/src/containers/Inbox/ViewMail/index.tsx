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
  const senderName =
    mail?.data.from?.match(/^(.*?)</)?.[1]?.trim() || mail?.data.from;
  const senderEmail = mail?.data.from?.match(/<(.*?)>/)?.[1];
  const dateStr = mail?.data.date
    ? new Date(mail.data.date).toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  return (
    <div className="w-full h-full bg-background">
      <div className="px-5 py-6 max-w-[1200px] mx-auto">
        {/* Header: Subject and badge */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-[22px] leading-[28px] font-normal text-foreground">
              {mail?.data.subject || "(No Subject)"}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              {mail?.data.category && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-200 dark:bg-yellow-900/30 text-orange-600 dark:text-orange-300 font-medium rounded-md px-2 py-0.5 text-xs uppercase tracking-wider"
                >
                  {mail.data.category.type.split("_").join(" ")}
                </Badge>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleSummarize}
                disabled={isStreaming || isRequestPending}
                className="group h-8 md:h-9 border border-border bg-linear-to-r from-purple-800 to-purple-500 text-white font-medium px-4 ml-2 shadow-sm rounded-full transition-all hover:from-purple-100 hover:to-purple-50 hover:text-purple-800 hover:border-purple-300"
              >
                {isStreaming || isRequestPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-white group-hover:text-purple-800" />
                ) : (
                  <LucideSparkles className="w-4 h-4 mr-2 text-white group-hover:text-purple-800" />
                )}
                {isStreaming || isRequestPending
                  ? "Summarizing..."
                  : "Summarize"}
              </Button>
            </div>
          </div>
        </div>

        {/* Sender Info Row */}
        <div className="flex items-start gap-4 mb-8">
          <Image
            width={40}
            height={40}
            src="/avatar.png"
            alt="Sender Avatar"
            className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 p-0.5"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline flex-wrap gap-2">
              <span className="font-bold text-foreground text-[15px]">
                {senderName}
              </span>
              <span className="text-[13px] text-muted-foreground">
                {senderEmail && `<${senderEmail}>`}
              </span>
              <span className="text-[12px] text-muted-foreground mx-1">
                {dateStr}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[13px] text-muted-foreground">
              <span>to</span>
              <span className="text-foreground">
                {mail?.data.to.join(", ")}
              </span>
            </div>
            {mail?.data.category?.reason && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded w-fit">
                Reason: {mail.data.category.reason}
              </p>
            )}
          </div>
        </div>

        {/* Summary Section */}
        {(summary || isStreaming) && (
          <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30">
            <div className="flex items-center gap-2 mb-2 text-purple-900 dark:text-purple-300 font-semibold text-sm">
              <LucideSparkles className="w-4 h-4" />
              <span>AI Summary</span>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
              <ReactMarkdown>{summary}</ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-1.5 h-3 ml-1 bg-purple-400 animate-pulse rounded-sm align-middle" />
              )}
            </div>
          </div>
        )}

        {/* Email Body */}
        <div className="w-full overflow-hidden">
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-foreground font-sans
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-img:max-w-full prose-img:h-auto prose-img:rounded-md
              prose-p:leading-relaxed prose-p:my-2
              prose-headings:font-normal prose-headings:text-foreground
              prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: safeHTML }}
          />
        </div>
      </div>
    </div>
  );
}
