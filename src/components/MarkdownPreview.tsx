"use client";
import { useState } from "react";

export default function MarkdownPreview({ content }: { content: string }) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  function renderMarkdown(md: string) {
    let html = md
      .replace(/^### (.+)$/gm, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2 class='text-xl font-bold mt-5 mb-2'>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-6 mb-3'>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code class='bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm'>$1</code>")
      .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' class='text-indigo-600 underline'>$1</a>")
      .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
      .replace(/\n\n/g, "<br/><br/>")
      .replace(/\n/g, "<br/>");
    return html;
  }

  return (
    <div>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-3">
        <button onClick={() => setTab("write")} className={`px-3 py-1.5 text-sm font-medium border-b-2 transition ${tab === "write" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>Escritura</button>
        <button onClick={() => setTab("preview")} className={`px-3 py-1.5 text-sm font-medium border-b-2 transition ${tab === "preview" ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>Vista Previa</button>
      </div>
      {tab === "preview" ? (
        <div className="prose dark:prose-invert max-w-none min-h-[200px] p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) || "<p class='text-gray-400'>Nada que previsualizar...</p>" }} />
      ) : null}
    </div>
  );
}
