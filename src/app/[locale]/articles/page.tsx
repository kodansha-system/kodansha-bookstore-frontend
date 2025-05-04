"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { api } from "@/services/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Article {
  id: string;
  title: string;
  image: string;
  created_at: string;
  created_by: {
    name: string;
  };
}

const fetchArticles = async ({
  pageParam = 1,
}): Promise<{ data: Article[]; nextPage: number | null }> => {
  const res = await api.get(`/articles?current=${pageParam}&pageSize=10`);

  const hasMore = res.data.articles.length === 10;

  return {
    data: res.data.articles,
    nextPage: hasMore ? pageParam + 1 : null,
  };
};

const ArticlePage = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["articles"],
      queryFn: fetchArticles,
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => lastPage.nextPage,
    });
  const router = useRouter();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Auto load when scroll to bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 1.0,
      },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.disconnect();
      }
    };
  }, [fetchNextPage, hasNextPage]);

  return (
    <div className="mx-auto max-w-[80%] rounded-md bg-white p-6">
      <h1 className="mb-6 text-2xl font-bold">Danh sách bài viết</h1>

      <div className="grid grid-cols-2 gap-6">
        {data?.pages.map((page, i) =>
          page.data.map((article) => (
            <div
              className="flex gap-4 rounded-lg border p-4 shadow transition hover:shadow-lg"
              key={article.id}
              onClick={() => router.push(`/articles/${article.id}`)}
            >
              <Image
                alt={article.title}
                className="h-[80px] w-[120px] rounded object-cover"
                height={80}
                src={article.image}
                width={120}
              />

              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{article.title}</h2>

                  <p className="text-sm text-gray-500">
                    Người viết: {article.created_by?.name}
                  </p>
                </div>

                <p className="text-xs text-gray-400">
                  {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )),
        )}
      </div>

      <div
        className="mt-6 flex h-10 items-center justify-center"
        ref={loadMoreRef}
      >
        {isFetching || isFetchingNextPage ? (
          <p>Đang tải...</p>
        ) : hasNextPage ? (
          <p>Kéo xuống để xem thêm</p>
        ) : (
          <p>Không còn bài viết</p>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
