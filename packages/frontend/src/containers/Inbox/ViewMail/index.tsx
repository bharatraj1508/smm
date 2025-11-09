"use client";

import { useGetMailbyId } from "@/services/gmail";
import DOMPurify from "dompurify";
import Image from "next/image";

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

function extractPlainText(rawHTML: string): string {
  if (!rawHTML) return "";
  const htmlIndex = rawHTML.search(/<\s*(?:!DOCTYPE|html)/i);
  const beforeHTML = rawHTML.slice(0, htmlIndex);
  return beforeHTML;
}

export default function ViewMail({ id }: ViewMailProps) {
  const { data: mail, isPending } = useGetMailbyId(id);

  if (isPending) return <div>Loading...</div>;

  const safeHTML = cleanEmailHTML(mail?.data.body || "");
  const body = extractPlainText(mail?.data.body || "");

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
          <div className="flex items-start justify-center flex-col gap-4">
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
