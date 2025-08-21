"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { gemini } from "@/lib/gemini";
import { useState } from "react";

export default function AiTestPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");

    try {
      const response = await gemini.generateContent(prompt);
      const text = response.response.text();
      setResult(text);
    } catch (err) {
      console.error("AI request failed:", err);
      setResult("⚠️ AI request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-2">
      <h1 className="text-2xl font-bold mb-4">AI Test (Gemini)</h1>

      <Textarea
        className="w-full border rounded-md p-3"
        placeholder="Ask your question here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 rounded-md disabled:opacity-50"
      >
        {loading ? "Loading..." : "Send"}
      </Button>

      {result && (
        <div className="mt-6 p-4 border rounded-md bg-gray-50 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}
