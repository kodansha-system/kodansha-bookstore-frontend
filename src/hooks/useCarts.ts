import { api } from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const fetchCart = async (params: any) => {
  const response = await api.get("/carts", { params });

  return response.data;
};

const getDetailCarts = async () => {
  const response = await api.get(`/carts/user`);

  return {
    books: response.data.books || [],
    flash_sale_id: response?.data?.flash_sale_id || undefined,
  };
};

export const useCarts = (params: any) => {
  return useQuery({
    queryKey: ["carts", params],
    queryFn: () => fetchCart(params),
  });
};

export const useDetailCart = () => {
  const { data: responseDetailCart, refetch } = useQuery({
    queryKey: ["detail-cart"],
    queryFn: () => getDetailCarts(),
  });

  return {
    data:
      responseDetailCart?.books?.map((item: any) => {
        return {
          id: item?.book_id?._id,
          name: item?.book_id?.name,
          price: item?.book_id?.price,
          origin_price: item?.book_id?.origin_price,
          discount: item?.book_id?.origin_price - item?.book_id?.price,
          image: item?.book_id?.images[0],
          quantity: item?.quantity,
          total: item?.quantity * item?.book_id?.price,
          checked: false,
          is_flash_sale: item?.book_id?.is_flash_sale,
          weight: item?.book_id?.weight,
          width: item?.book_id?.width,
          height: item?.book_id?.height,
          length: item?.book_id?.length,
        };
      }) || [],
    flash_sale_id: responseDetailCart?.flash_sale_id,
    refetch,
  };
};
