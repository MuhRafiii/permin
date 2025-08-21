"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gemini } from "@/lib/gemini";
import { useState } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const systemPrompt = `
    Kamu adalah pustakawan virtual. Jawablah pertanyaan user berdasarkan judul buku "Laskar Pelangi"
    dengan bahasa sederhana.
  `;

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Tambahkan pesan user ke state
    const newMessages = [
      ...messages,
      { role: "user", content: input } as Message,
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Gabungkan percakapan sebelumnya + sistem prompt
      const history = newMessages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");

      const result = await gemini.generateContent([systemPrompt, history]);

      const aiText = result.response.text();

      setMessages([...newMessages, { role: "ai", content: aiText }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-2xl mx-auto">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              m.role === "user"
                ? "bg-gray-900 text-white ml-auto"
                : "bg-gray-200 text-black mr-auto"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-xl bg-gray-300 text-black w-fit">...</div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2 border-t">
        <Input
          className="py-5"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the book..."
        />
        <Button
          onClick={sendMessage}
          disabled={loading}
          className="bg-gray-900 py-5"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
