const API_BASE = "http://localhost:8000";

export async function sendQuery(query: string) {
  const res = await fetch(`${API_BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: 5 }),
  });
  return res.json();
}

export async function ingestURL(url: string) {
  const res = await fetch(`${API_BASE}/ingest/urls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls: [url] }),
  });
  return res.json();
}

export async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const res = await fetch(`${API_BASE}/ingest/files`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}
