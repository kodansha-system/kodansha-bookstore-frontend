"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { api } from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

import CommentsSection from "../components/Comments";

const fetchArticleDetail = async (slug: string) => {
  const res = await api.get(`/articles/${slug}`);

  if (!res.data) throw new Error("Không thể lấy dữ liệu bài viết");

  return res;
};

const ArticleDetailPage = () => {
  const { slug } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["article-detail", slug],
    queryFn: () => fetchArticleDetail(slug as string),
    enabled: !!slug,
  });

  if (isLoading) return <p>Đang tải bài viết...</p>;
  if (error) return <p>Đã xảy ra lỗi khi tải bài viết</p>;

  const article = data?.data || {};

  return (
    <div>
      <div className="mx-auto max-w-[90%] space-y-6 rounded-md bg-white p-6 px-10 text-sm">
        <h1 className="text-[20px] font-bold lg:text-2xl">{article.title}</h1>

        <div className="italic text-gray-400">
          Cập nhật vào:&nbsp;
          {new Date(article?.updated_at).toLocaleDateString("vi-VN")}
        </div>

        {article.image && (
          <div className="relative h-[400px] w-full overflow-hidden rounded">
            <Image
              alt={article.title}
              layout="fill"
              objectFit="cover"
              src={article.image}
            />
          </div>
        )}

        <div
          className="prose prose-lg text-sm"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="text-right text-sm">
          <div className="mb-3">Được thêm bởi: {article?.created_by?.name}</div>

          <div>
            <a
              className="inline-block text-right text-sm text-blue-600 hover:underline"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://youtu.be/RuqJGL7PdsE?si=b8WGy05wIIy63Bzz")}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Chia sẻ lên Facebook
            </a>
          </div>
        </div>
      </div>

      <CommentsSection articleId={Array.isArray(slug) ? slug[0] : slug} />
    </div>
  );
};

export default ArticleDetailPage;
