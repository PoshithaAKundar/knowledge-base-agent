import React, { useState } from "react";
import type { CSSProperties, ChangeEvent } from "react";
import { sendQueryStream } from "../api";

interface Message {
  role: "user" | "bot";
  text: string;
}

const styles: Record<string, CSSProperties> = {
  container: { width: "100%", maxWidth: 800, margin: "0 auto" },
  chatBox: {
    height: "60vh",
    border: "1px solid #ddd",
    overflowY: "auto",
    padding: 12,
    background: "#fafafa",
    borderRadius: 8,
  },
  inputRow: {
    display: "flex",
    gap: 10,
    marginTop: 12,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 16px",
    fontWeight: 600,
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  userMsg: {
    background: "#d1e8ff",
    padding: "8px 12px",
    borderRadius: 6,
    marginBottom: 6,
    textAlign: "right" as const,
  },
  botMsg: {
    background: "#e4e4e4",
    padding: "8px 12px",
    borderRadius: 6,
    marginBottom: 6,
    textAlign: "left" as const,
  },
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const send = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");

    // Add user message + placeholder bot message
    const userMessage: Message = { role: "user", text: question };
    const botMessage: Message = { role: "bot", text: "" };

    // Compute bot index based on current messages length
    const botIndex = messages.length + 1;

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setLoading(true);

    try {
      await sendQueryStream(question, (chunk) => {
        // Append each new chunk to the latest bot message
        setMessages((prev) => {
          const updated = [...prev];
          const currentBot = updated[botIndex] || { role: "bot", text: "" };
          updated[botIndex] = {
            ...currentBot,
            text: (currentBot.text || "") + chunk,
          };
          return updated;
        });
      });
    } catch (err: any) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[botIndex] = {
          role: "bot",
          text: `Error streaming from server: ${err?.message ?? String(err)}`,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={m.role === "user" ? styles.userMsg : styles.botMsg}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <div style={styles.botMsg}>
            <i>Streaming response…</i>
          </div>
        )}
      </div>

      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={handleChange}
          placeholder="Ask something..."
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button style={styles.button} onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
