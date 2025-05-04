"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { api } from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

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
    <div className="mx-auto max-w-[80%] space-y-6 rounded-md bg-white p-6 px-10">
      <h1 className="text-3xl font-bold">{article.title}</h1>

      <div className="italic text-gray-400">
        Cập nhật vào: {new Date(article?.updated_at).toLocaleDateString()}
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
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      <div className="text-right">
        Được tạo bởi: {article?.created_by?.name}
      </div>
    </div>
  );
};

export default ArticleDetailPage;
