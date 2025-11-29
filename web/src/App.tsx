import React, { useState } from "react";
import Chat from "./components/Chat";
import FileUpload from "./components/FileUpload";
import UrlUpload from "./components/UrlUpload";

type View = "chat" | "files" | "urls";

export default function App() {
  const [view, setView] = useState<View>("chat");

  return (
    <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
      <h1>📚 Knowledge Base Agent (Gemini RAG)</h1>

      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <button onClick={() => setView("chat")}>💬 Chat</button>
        <button onClick={() => setView("files")}>📁 Upload Files</button>
        <button onClick={() => setView("urls")}>🌍 Add URLs</button>
      </div>

      {view === "chat" && <Chat />}
      {view === "files" && <FileUpload />}
      {view === "urls" && <UrlUpload />}
    </div>
  );
}
