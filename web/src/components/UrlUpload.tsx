import React, { useState } from "react";
import { uploadUrls } from "../api";

export default function UrlUpload() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");

  const onAdd = async () => {
    if (!url.trim()) {
      setStatus("Please enter a URL.");
      return;
    }
    setStatus("Fetching and indexing URL…");
    try {
      const res = await uploadUrls([url.trim()]);
      setStatus(`✅ Indexed ${res.indexed_chunks} chunks from URL.`);
      setUrl("");
    } catch (err: any) {
      setStatus(`❌ URL ingest failed: ${err?.message ?? String(err)}`);
    }
  };

  return (
    <div>
      <h3>🌍 Add Web Pages to Knowledge Base</h3>
      <input
        style={{ width: "70%", padding: 8 }}
        placeholder="https://example.com/page"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={onAdd} style={{ marginLeft: 8 }}>
        Add
      </button>
      {status && <p style={{ marginTop: 8 }}>{status}</p>}
    </div>
  );
}
