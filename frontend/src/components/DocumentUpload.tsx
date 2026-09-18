import { CheckCircle2, FileText, Loader2, UploadCloud, X } from "lucide-react";

import { useRef, useState } from "react";

import { uploadDocument, type UploadResponse } from "../services/api";

type DocumentUploadProps = {
  onUploaded: (result: UploadResponse) => void;
};

export default function DocumentUpload({ onUploaded }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  function chooseFile(selectedFile?: File) {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setSuccess("");
  }

  async function handleUpload() {
    if (!file || uploading) return;

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const result = await uploadDocument(file);

      setSuccess(`${result.fileName} indexed successfully`);

      onUploaded(result);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Document upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
          <UploadCloud size={20} />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Knowledge source
          </h3>

          <p className="mt-0.5 text-[11px] text-slate-500">
            Upload a PDF and ask questions about it.
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        hidden
        onChange={(event) => chooseFile(event.target.files?.[0])}
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400/30 bg-emerald-400/[0.025] text-emerald-300 transition hover:border-emerald-300/60 hover:bg-emerald-400/[0.06]"
        >
          <UploadCloud size={28} />

          <strong className="text-xs text-slate-200">Choose a PDF</strong>

          <span className="text-[10px] text-slate-500">PDF documents only</span>
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-slate-950/40 p-3">
          <div className="flex min-w-0 items-center gap-3 text-emerald-300">
            <FileText size={20} className="shrink-0" />

            <div className="min-w-0">
              <strong className="block truncate text-[11px] text-slate-200">
                {file.name}
              </strong>

              <span className="text-[9px] text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setFile(null);
              setSuccess("");
              setError("");
            }}
            className="ml-3 text-slate-500 transition hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {file && !success && (
        <button
          type="button"
          disabled={uploading}
          onClick={handleUpload}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-300 to-sky-300 px-4 py-3 text-xs font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Processing document...
            </>
          ) : (
            <>
              <UploadCloud size={17} />
              Upload & index
            </>
          )}
        </button>
      )}

      {success && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-400/[0.08] p-3 text-[10px] text-emerald-300">
          <CheckCircle2 size={17} />
          {success}
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-xl bg-rose-400/[0.08] p-3 text-[10px] text-rose-300">
          {error}
        </div>
      )}
    </div>
  );
}
