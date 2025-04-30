import { api } from "@/services/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const fetchBooks = async (params: any) => {
  const response = await api.get("/books", { params });

  return response.data;
};

const getDetailBooks = async (id: string) => {
  const response = await api.get(`/books/${id}`);

  return response.data;
};

export const useBooks = (params: any) => {
  return useInfiniteQuery({
    queryKey: ["books", params],
    queryFn: ({ pageParam = 1 }) => fetchBooks({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { currentPage, totalPages } = lastPage.pagination;

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
};

export const useDetailBook = (id: string) => {
  const responseDetailBook = useQuery({
    queryKey: ["detail-book", id],
    queryFn: () => getDetailBooks(id),
  });

  const params = { category_id: responseDetailBook?.data?.category_id };

  const responseList = useQuery({
    queryKey: ["books-2", params],
    enabled: !!params?.category_id,
    queryFn: () => fetchBooks(params),
  });

  return {
    listBookSameCategory: responseList?.data?.books || [],
    detailBook: responseDetailBook?.data || {},
  };
};
