import { api } from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const fetchCart = async (params: any) => {
  const response = await api.get("/carts", { params });

  return response.data;
};

const getDetailCarts = async () => {
  const response = await api.get(`/carts/user`);

  return response.data.books || [];
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
      responseDetailCart?.map((item: any) => {
        return {
          id: item?.book_id?.id,
          name: item?.book_id?.name,
          price: item?.book_id?.price,
          discount: item?.book_id?.discount,
          image: item?.book_id?.images[0],
          quantity: item?.quantity,
          total: item?.quantity * item?.book_id?.price,
          checked: false,
        };
      }) || [],
    refetch,
  };
};
