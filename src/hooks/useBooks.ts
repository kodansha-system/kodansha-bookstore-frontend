import { api } from "@/services/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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

  const params = { categoryId: responseDetailBook?.data?.category_id[0]?.id };

  const responseList = useQuery({
    queryKey: ["books-2", params],
    enabled: !!params?.categoryId,
    queryFn: () => fetchBooks(params),
  });

  return {
    listBookSameCategory: responseList?.data?.books || [],
    detailBook: responseDetailBook?.data || {},
  };
};
