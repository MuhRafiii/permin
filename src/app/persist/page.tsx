"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { gemini } from "@/lib/gemini";
import api from "@/services/api";
import { ImageIcon, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Tesseract from "tesseract.js";

type Message = {
  role: "user" | "ai";
  text?: string;
  image?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  if (user?.role === "admin") {
    router.push("/admin");
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "You have to logout for guest access.",
      confirmButtonColor: "#d33",
    });
    return;
  }

  // Auto scroll ke bawah tiap ada message baru
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input && !image) return;

    const newMessage: Message = {
      role: "user",
      text: input,
      image: image ? URL.createObjectURL(image) : undefined,
    };
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);
    setInput("");
    setImage(null);

    try {
      let aiResponse = "";

      // Buat history percakapan (user + ai)
      const conversationHistory = [...messages, newMessage]
        .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.text || ""}`)
        .join("\n");

      // cek apakah pertanyaan terkait buku
      const isBookQuery =
        input.toLowerCase().includes("buku") ||
        input.toLowerCase().includes("book") ||
        input.toLowerCase().includes("recommend");

      if (isBookQuery) {
        // fetch data buku dari database
        const res = await api.get("/books"); // asumsi endpoint GET /books
        const books = res.data.sortedBooks;
        const bookList = books
          .map(
            (b: any) => `- ${b.title} oleh ${b.author} (${b.categories.name})`
          )
          .join("\n");

        const prompt = `
          Ini adalah percakapan antara User dan AI Pustakawan:

          ${conversationHistory}

          User baru bertanya: "${input}"

          📚 Berikut daftar buku yang tersedia di library:
          ${bookList}

          ⚠️ Aturan menjawab:
          1. Jawablah **hanya berdasarkan daftar buku di atas**.
          2. Jika user meminta daftar, tampilkan dengan format bullet point agar rapi.
          3. Jika user minta rekomendasi, jelaskan alasan singkat kenapa buku itu relevan.
          4. Jangan menyebutkan buku lain yang tidak ada di daftar.
          `;

        const result = await gemini.generateContent(prompt);
        aiResponse = result.response.text();
      } else {
        // percakapan umum (bisa gambar juga)
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

        finalPrompt = `
          Ini adalah percakapan antara User dan AI Pustakawan:

          ${conversationHistory}

          User baru bertanya: "${input}"

          Jawablah sebagai AI Pustakawan yang ramah, 
          jelaskan seolah membantu siswa SMA. Gunakan paragraf singkat atau bullet point agar rapi.

          ${finalPrompt}
          `;

        const result = await gemini.generateContent(finalPrompt);
        aiResponse = result.response.text() || "No result";
      }

      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "❌ Failed to get response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">AI Chat with GeminiAI</h1>

      <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.role === "user"
                ? "bg-gray-900 text-white self-end ml-auto"
                : "bg-gray-200 text-black"
            }`}
          >
            {msg.image && (
              <img src={msg.image} alt="uploaded" className="w-12 rounded-lg" />
            )}
            {msg.text && <p className="whitespace-pre-line">{msg.text}</p>}
          </div>
        ))}
        {loading && <p className="text-gray-500">⏳ Thinking...</p>}
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
          className="bg-gray-50"
          placeholder="Ask something about this book..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !loading) {
              e.preventDefault();
              handleSend();
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
            onClick={handleSend}
            disabled={loading}
            size="sm"
            className="w-7 h-7"
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}
