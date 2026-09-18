import { FileText } from "lucide-react";
import type { Source } from "../services/api";

type SourceBadgeProps = {
  source: Source;
};

export default function SourceBadge({ source }: SourceBadgeProps) {
  return (
    <div className="flex max-w-full items-center gap-1.5 rounded-lg border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1.5 text-[10px] text-emerald-300">
      <FileText size={14} className="shrink-0" />

      <span className="truncate">{source.fileName}</span>

      <span className="shrink-0 text-slate-500">Page {source.pageNumber}</span>
    </div>
  );
}
