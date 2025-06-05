"use client";

import React, { useEffect, useState } from "react";

import { api } from "@/services/axios";

export const getComments = async (articleId: string) => {
  const res = await api.get(`/comments/article/${articleId}`);

  return res.data;
};

export const postComment = async (data: {
  content: string;
  article_id: string;
  reply_to?: string;
}) => {
  const res = await api.post(`/comments`, data);

  return res.data;
};

export default function CommentSection({ articleId }: { articleId: string }) {
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<null | string>(null);
  const [replyToName, setReplyToName] = useState<null | string>(null);
  const [comments, setComments] = useState<any[]>([]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const content = input.replace(`@${replyToName} `, "").trim();

    const newComment = await postComment({
      content,
      article_id: articleId,
      ...(replyTo ? { reply_to: replyTo } : {}),
    });

    setComments((prev) => [...prev, newComment]);
    setInput("");
    setReplyTo(null);
    setReplyToName(null);

    fetchComments();
  };

  const handleReply = (comment: any) => {
    setReplyTo(comment?.created_by?.name);
    setReplyToName(comment?.created_by?.name);
    setInput(`@${comment?.created_by?.name} `);
  };

  const fetchComments = async () => {
    const res = await getComments(articleId);

    setComments(res);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="mx-auto mt-10 w-full max-w-[900px] px-4">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Bình luận</h2>

      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div
            className="flex flex-col rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
            key={comment.id}
          >
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                {/* {comment.createdBy.charAt(0)} */}
              </div>

              <span className="text-sm font-semibold text-gray-800">
                {comment.created_by?.name}
              </span>
            </div>

            <div className="mt-2 text-sm leading-relaxed text-gray-700">
              {comment.reply_to && (
                <span className="mr-1 font-medium text-blue-600">
                  @{comment.reply_to}
                </span>
              )}

              {comment.content}
            </div>

            <button
              className="mt-2 self-start text-xs text-blue-500 hover:underline"
              onClick={() => handleReply(comment)}
            >
              Trả lời
            </button>
          </div>
        ))}
      </div>

      {/* Form nhập bình luận */}
      <div className="mt-10 rounded-lg border bg-white p-4 shadow">
        <textarea
          className="w-full rounded border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập bình luận của bạn..."
          rows={4}
          value={input}
        />

        <div className="mt-3 flex justify-end">
          <button
            className="rounded bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Gửi bình luận
          </button>
        </div>
      </div>
    </div>
  );
}
