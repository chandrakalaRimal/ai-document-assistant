const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5102";

export type Source = {
  fileName: string;
  pageNumber: number;
  score: number;
};

export type ChatResponse = {
  answer: string;
  sources: Source[];
};

export type UploadResponse = {
  documentId: string;
  fileName: string;
  pages: number;
  chunks: number;
  message: string;
};

export async function askAssistant(question: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(message || "Unable to get a response from SmartLife AI.");
  }

  return response.json();
}

export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(message || "Unable to upload the document.");
  }

  return response.json();
}
