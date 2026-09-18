import { Bot, User } from "lucide-react";
import type { Source } from "../services/api";
import SourceBadge from "./SourceBadge";

export type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
};

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`mb-6 flex gap-3 ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      {isAssistant && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
          <Bot size={17} />
        </div>
      )}

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-[13px] leading-7 ${
          isAssistant
            ? "rounded-tl-sm border border-white/5 bg-white/[0.035] text-slate-300"
            : "rounded-tr-sm border border-emerald-300/15 bg-gradient-to-br from-emerald-500/35 to-indigo-500/30 text-slate-100"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 border-t border-white/5 pt-3">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Sources
            </p>

            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, index) => (
                <SourceBadge
                  key={`${source.fileName}-${source.pageNumber}-${index}`}
                  source={source}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-indigo-400/10 text-indigo-300">
          <User size={17} />
        </div>
      )}
    </div>
  );
}
