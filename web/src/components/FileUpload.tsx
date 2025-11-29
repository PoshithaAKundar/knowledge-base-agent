import React, { useState } from "react";
import { uploadFiles } from "../api";

export default function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string>("");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const onUpload = async () => {
    if (files.length === 0) {
      setStatus("Please select at least one file.");
      return;
    }
    setStatus("Uploading and indexing…");
    try {
      const res = await uploadFiles(files);
      setStatus(
        `✅ Indexed ${res.indexed_chunks} chunks from ${res.files?.length ?? 0} file(s).`
      );
    } catch (err: any) {
      setStatus(`❌ Upload failed: ${err?.message ?? String(err)}`);
    }
  };

  return (
    <div>
      <h3>📁 Upload Files to Knowledge Base</h3>
      <input type="file" multiple onChange={onFileChange} />
      <button onClick={onUpload} style={{ marginLeft: 8 }}>
        Upload
      </button>
      {status && <p style={{ marginTop: 8 }}>{status}</p>}
    </div>
  );
}
