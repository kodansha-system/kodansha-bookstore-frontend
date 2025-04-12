import { api } from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

const fetchCart = async (params: any) => {
  const response = await api.get("/carts", { params });

  return response.data;
};

export const useCarts = (params: any) => {
  return useQuery({
    queryKey: ["carts", params],
    queryFn: () => fetchCart(params),
  });
};
