const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";


export interface QueryResponse {
  answer: string;
  citations: {
    chunk_id: string;
    title?: string | null;
    uri: string;
    page?: number | null;
  }[];
  usage: Record<string, unknown>;
}
export async function sendQueryStream(
  query: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const res = await fetch(`${API_BASE}/stream_query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: 5 }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Streaming failed with status ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      const text = decoder.decode(value, { stream: !done });
      if (text) {
        onChunk(text);
      }
    }
  }
}
export async function sendQuery(query: string): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: 5 }),
  });
  if (!res.ok) {
    throw new Error(`Query failed: ${res.status}`);
  }
  return res.json();
}

export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const res = await fetch(`${API_BASE}/ingest/files`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`File upload failed: ${res.status}`);
  }
  return res.json();
}

export async function uploadUrls(urls: string[]) {
  const res = await fetch(`${API_BASE}/ingest/urls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls }),
  });
  if (!res.ok) {
    throw new Error(`URL ingest failed: ${res.status}`);
  }
  return res.json();
}
