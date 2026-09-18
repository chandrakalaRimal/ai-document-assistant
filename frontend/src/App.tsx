import {
  Bot,
  ChevronRight,
  FileSearch,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";

import { type FormEvent, useEffect, useRef, useState } from "react";

import ChatMessage, { type Message } from "./components/ChatMessage";

import DocumentUpload from "./components/DocumentUpload";

import { askAssistant, type UploadResponse } from "./services/api";

const quickQuestions = [
  "Summarize this document",
  "What are the key points?",
  "What skills are mentioned?",
];

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "Hi! I'm SmartLife AI. Upload a PDF, then ask me anything about the document.",
    },
  ]);

  const [input, setInput] = useState("");

  const [thinking, setThinking] = useState(false);

  const [document, setDocument] = useState<UploadResponse | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, thinking]);

  async function sendQuestion(question: string) {
    const cleanedQuestion = question.trim();

    if (!cleanedQuestion || thinking) {
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: cleanedQuestion,
    };

    setMessages((previous) => [...previous, userMessage]);

    setInput("");
    setThinking(true);

    try {
      const response = await askAssistant(cleanedQuestion);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: response.answer,
        sources: response.sources,
      };

      setMessages((previous) => [...previous, assistantMessage]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text:
            error instanceof Error
              ? `I couldn't complete that request. ${error.message}`
              : "Something went wrong while contacting the AI.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await sendQuestion(input);
  }

  function clearChat() {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Conversation cleared. Ask me another question about your document.",
      },
    ]);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b14] text-slate-100">
      {/* background glow */}
      <div className="pointer-events-none fixed -left-28 -top-28 h-80 w-80 rounded-full bg-emerald-400/10 blur-[110px]" />

      <div className="pointer-events-none fixed -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-indigo-500/10 blur-[130px]" />

      {/* Header */}
      <header className="relative z-20 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#070b14]/80 px-5 backdrop-blur-xl md:px-9">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-sky-300 text-slate-950 shadow-lg shadow-emerald-400/10">
            <Sparkles size={21} />
          </div>

          <div>
            <strong className="block text-[15px]">SmartLife AI</strong>

            <span className="text-[11px] text-slate-500">
              Document Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />

          <span className="hidden sm:inline">AI connected</span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-76px)] max-w-[1420px] grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="border-b border-white/[0.07] bg-gradient-to-b from-slate-900/70 to-slate-950/20 px-5 py-8 lg:border-b-0 lg:border-r lg:px-7 lg:py-10">
          <div className="mb-7">
            <span className="mb-2 block text-[10px] font-bold tracking-[0.16em] text-emerald-300">
              YOUR KNOWLEDGE
            </span>

            <h2 className="max-w-[270px] text-2xl font-semibold leading-tight text-slate-100">
              Chat with your documents.
            </h2>

            <p className="mt-3 text-[13px] leading-6 text-slate-500">
              Upload a PDF and SmartLife AI will retrieve relevant information
              before generating an answer.
            </p>
          </div>

          <DocumentUpload onUploaded={(result) => setDocument(result)} />

          {document && (
            <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-400">
                <FileSearch size={17} />
                Indexed document
              </div>

              <strong className="block truncate text-[11px] text-slate-200">
                {document.fileName}
              </strong>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/[0.025] p-3">
                  <span className="block text-[9px] text-slate-500">Pages</span>

                  <strong className="mt-1 block text-base text-emerald-300">
                    {document.pages}
                  </strong>
                </div>

                <div className="rounded-xl bg-white/[0.025] p-3">
                  <span className="block text-[9px] text-slate-500">
                    Chunks
                  </span>

                  <strong className="mt-1 block text-base text-emerald-300">
                    {document.chunks}
                  </strong>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <Sparkles size={17} className="text-indigo-300" />

            <div>
              <strong className="block text-[10px] text-indigo-200">
                Powered by RAG
              </strong>

              <span className="text-[9px] text-slate-500">
                Local embeddings + Qdrant + Groq
              </span>
            </div>
          </div>
        </aside>

        {/* Chat */}
        <section className="flex min-h-[760px] flex-col lg:h-[calc(100vh-76px)] lg:min-h-0">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-white/[0.05] px-5 py-5 md:px-8">
            <div>
              <span className="mb-1 block text-[10px] font-bold tracking-[0.16em] text-emerald-300">
                AI ASSISTANT
              </span>

              <h1 className="text-xl font-semibold">Ask your document</h1>
            </div>

            <button
              type="button"
              onClick={clearChat}
              className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-200"
            >
              <Trash2 size={15} />
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 md:px-12 lg:px-[7%]">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {thinking && (
              <div className="mb-6 flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Bot size={17} />
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white/[0.035] px-4 py-3 text-[11px] text-slate-400">
                  <Loader2 size={16} className="animate-spin" />
                  Searching your document...
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Footer */}
          <div className="border-t border-white/[0.05] bg-[#070b14]/80 px-4 py-4 backdrop-blur-xl sm:px-8 md:px-12 lg:px-[7%]">
            {messages.length <= 1 && (
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => sendQuestion(question)}
                    className="flex shrink-0 items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] text-slate-400 transition hover:border-emerald-300/20 hover:text-slate-200"
                  >
                    <MessageSquareText size={14} />

                    {question}

                    <ChevronRight size={13} />
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 shadow-2xl shadow-black/10 transition focus-within:border-emerald-300/30 focus-within:ring-4 focus-within:ring-emerald-300/[0.03]"
            >
              <textarea
                rows={1}
                value={input}
                disabled={thinking}
                placeholder="Ask anything about your uploaded document..."
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();

                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                className="max-h-32 min-h-6 flex-1 resize-none bg-transparent text-xs leading-6 text-slate-200 outline-none placeholder:text-slate-600 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-sky-300 text-slate-950 shadow-lg shadow-emerald-400/10 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </form>

            <p className="mt-2 text-center text-[9px] text-slate-600">
              SmartLife AI answers using information retrieved from your
              uploaded documents.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
