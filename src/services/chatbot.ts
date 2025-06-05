import { NextApiRequest, NextApiResponse } from "next";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_CHATBOT_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Bạn là trợ lý sách thông minh. Trả lời ngắn gọn dưới 50 từ.",
        },
        ...messages,
      ],
      max_tokens: 100,
    });

    const message = completion.choices[0].message.content;

    res.status(200).json({ message });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Có lỗi xảy ra" });
  }
}
