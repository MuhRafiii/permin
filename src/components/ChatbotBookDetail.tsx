"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { gemini } from "@/lib/gemini";
import { Image as ImageIcon, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Tesseract from "tesseract.js";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type Message = {
  role: "user" | "ai";
  text?: string;
  imageUrl?: string;
};

export default function ChatbotModal({ bookTitle }: { bookTitle: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll ke bawah tiap ada message baru
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleProcess = async () => {
    if (!input && !image) return;
    setLoading(true);
    setInput("");
    setImage(null);

    // Simpan message user (dengan gambar kalau ada)
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: input || undefined,
        imageUrl: image ? URL.createObjectURL(image) : undefined,
      },
    ]);
    try {
      let ocrText = "";

      if (image) {
        const { data } = await Tesseract.recognize(image, "eng");
        ocrText = data.text.trim();
      }

      let finalPrompt = "";
      if (image && input) {
        finalPrompt = `${input}\n\nBerikut teks yang diekstrak dari gambar:\n${ocrText}`;
      } else if (image && !input) {
        finalPrompt = `Jelaskan isi teks berikut agar mudah dipahami:\n\n${ocrText}`;
      } else if (!image && input) {
        finalPrompt = input;
      }

      finalPrompt = `Kamu adalah pustakawan yang ramah. Buku yang dibahas: "${bookTitle}". Jawab seolah membantu siswa SMA.\n\n${finalPrompt}`;

      const result = await gemini.generateContent(finalPrompt);
      const text = result.response.text() || "No result";

      setMessages((prev) => [...prev, { role: "ai", text }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Ask AI
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md flex flex-col h-[90vh] p-4 rounded-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Chat with Librarian AI With GeminiAI
            </DialogTitle>
            <p className="text-sm text-gray-500">
              book: <span className="font-semibold">{bookTitle}</span>
            </p>
          </DialogHeader>

          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] px-3 py-2 rounded-lg text-base ${
                  msg.role === "user"
                    ? "ml-auto bg-gray-900 text-white"
                    : "mr-auto bg-gray-200 text-gray-900"
                }`}
              >
                {/* tampilkan gambar jika ada */}
                {msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="uploaded"
                    className="w-12 rounded-md mb-2"
                  />
                )}
                {msg.text}
              </div>
            ))}
            {loading && (
              <p className="text-sm text-gray-500">AI is thinking...</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preview gambar */}
          {image && (
            <div>
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-16 h-16 object-cover rounded-md border"
              />
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-center gap-2">
            <Textarea
              placeholder="Ask something about this book..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !loading) {
                  e.preventDefault();
                  handleProcess();
                }
              }}
            />

            <div className="flex flex-col items-center">
              <Label>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImage(file);
                  }}
                />
                <ImageIcon className="w-8 h-8 text-gray-600 hover:text-gray-900 cursor-pointer" />
              </Label>
              <Button
                onClick={handleProcess}
                disabled={loading}
                className="w-7 h-7"
              >
                <Send />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
