import { api } from "@/services/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchBooks = async (params: any) => {
  const response = await api.get("/books", { params });

  return response.data;
};

const getDetailBooks = async (id: string) => {
  const response = await api.get(`/books/${id}`);

  const checkIsBookInFlashSale = await api.get(`/flashsales/book/${id}`);

  const inFlashSale = checkIsBookInFlashSale.data?.in_flash_sale;

  if (inFlashSale) {
    return {
      ...response.data,
      in_flash_sale: inFlashSale,
      flash_sale: {
        ...checkIsBookInFlashSale.data,
        end_time: checkIsBookInFlashSale.data.end_time,
      },
    };
  }

  return {
    ...response.data,
    in_flash_sale: inFlashSale,
  };
};

export const getRecommendAlsoBoughtBooks = async (bookId: string) => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_RECOMMENDATION +
      "/recommend/also-bought/" +
      bookId,
  );

  return response;
};

export const getRecommendBooksForUser = async (userId: string) => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_RECOMMENDATION + "/recommend/home/" + userId,
  );

  return response;
};

export const useBooks = (params: any) => {
  const query = useInfiniteQuery({
    queryKey: ["books", params],
    queryFn: ({ pageParam = 1 }) => fetchBooks({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { currentPage, totalPages } = lastPage.pagination;

      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  return {
    ...query,
    isLastPage: !query.hasNextPage,
  };
};

export const useDetailBook = (id: string) => {
  const responseDetailBook = useQuery({
    queryKey: ["detail-book", id],
    queryFn: () => getDetailBooks(id),
  });

  const params = { categoryId: responseDetailBook?.data?.category_id?.id };

  const responseList = useQuery({
    queryKey: ["books-2", params],
    enabled: !!params?.categoryId,
    queryFn: () => fetchBooks(params),
  });

  const responseRecommendAlsoBoughtBooks = useQuery({
    queryKey: ["books-3", id],
    queryFn: () => getRecommendAlsoBoughtBooks(id),
  });

  return {
    listBookSameCategory: [
      ...(responseRecommendAlsoBoughtBooks?.data?.data || []),
      // ...(responseList?.data?.books || []),
    ],
    detailBook: responseDetailBook?.data || {},
  };
};

export const useRecommendedBook = (userId: string) => {
  const query = useQuery({
    queryKey: ["recommended-books", userId],
    queryFn: () => getRecommendBooksForUser(userId),
    enabled: !!userId,
  });

  return query;
};
