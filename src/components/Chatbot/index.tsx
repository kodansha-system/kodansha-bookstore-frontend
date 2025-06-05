import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

import OpenAI from "openai";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey:
      "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",
    dangerouslyAllowBrowser: true,
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleChat = () => setOpen(!open);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response: any = await client.chat.completions.create({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: input.trim() }],
        max_completion_tokens: 80,
      });

      const aiMessage = response?.choices?.[0]?.message;

      if (aiMessage) {
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "AI hiện đang bận, vui lòng hỏi lại sau.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      <div className="group fixed bottom-4 right-4 z-50">
        <div
          className="cursor-pointer rounded-full bg-gradient-to-r from-blue-500 to-blue-700 p-3 text-white shadow-lg transition-transform duration-300 hover:scale-105"
          onClick={toggleChat}
        >
          💬
        </div>

        <div className="absolute -top-12 right-0 hidden w-60 rounded bg-blue-400 px-3 py-2 text-sm text-white group-hover:block">
          Bạn chưa biết nên mua sách nào?
        </div>
      </div>

      {open && (
        <Draggable handle=".drag-header">
          <div className="fixed bottom-20 right-4 z-50 flex h-[500px] w-96 flex-col rounded-2xl border bg-white shadow-xl">
            <div className="drag-header flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 font-semibold text-white">
              <span>🤖 KodanBot</span>

              <span className="cursor-pointer text-lg" onClick={toggleChat}>
                ✕
              </span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-4 text-sm">
              {messages.map((m, i) => (
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    m.role === "user"
                      ? "ml-auto bg-blue-100 text-right"
                      : "mr-auto bg-gray-200"
                  }`}
                  key={i}
                >
                  {m.content}
                </div>
              ))}

              {loading && (
                <div className="text-sm italic text-gray-400">
                  Đang trả lời...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 border-t bg-white px-3 py-2">
              <input
                className="flex-1 rounded-full border px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Hỏi gì đó..."
                value={input}
              />

              <button
                className="rounded-full bg-blue-500 px-4 py-2 text-sm text-white shadow transition hover:bg-blue-600"
                onClick={sendMessage}
              >
                Gửi
              </button>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
}
