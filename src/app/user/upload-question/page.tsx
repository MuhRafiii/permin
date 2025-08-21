"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { gemini } from "@/lib/gemini";
import { useState } from "react";
import Tesseract from "tesseract.js";

export default function UploadQuestion() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const handleProcess = async () => {
    if (!image && !prompt) return; // minimal salah satu ada
    setLoading(true);

    try {
      let ocrText = "";

      // Kalau ada gambar, jalankan OCR
      if (image) {
        const { data } = await Tesseract.recognize(image, "eng");
        ocrText = data.text.trim();
      }

      // Bangun prompt final
      let finalPrompt = "";
      if (image && prompt) {
        finalPrompt = `${prompt}\n\nBerikut teks yang diekstrak dari gambar:\n${ocrText}`;
      } else if (image && !prompt) {
        finalPrompt = `Jelaskan isi teks berikut agar mudah dipahami:\n\n${ocrText}`;
      } else if (!image && prompt) {
        finalPrompt = prompt;
      }

      const result = await gemini.generateContent(finalPrompt);
      const text =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No result";
      setResult(text);
    } catch (err) {
      console.error("Error:", err);
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Ask Gemini with OCR</h1>

      {/* Upload Preview */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="block"
      />
      {image && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="w-full max-h-64 object-contain rounded-md border"
          />
        </div>
      )}

      {/* Prompt Input */}
      <Textarea
        placeholder="Tulis pertanyaan atau instruksi di sini..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
      />

      {/* Action Button */}
      <Button onClick={handleProcess} disabled={loading || (!image && !prompt)}>
        {loading ? "Processing..." : "Send to Gemini"}
      </Button>

      {/* Result */}
      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Gemini Result:</h2>
          <p className="p-3 border rounded-md whitespace-pre-line">{result}</p>
        </div>
      )}
    </div>
  );
}
