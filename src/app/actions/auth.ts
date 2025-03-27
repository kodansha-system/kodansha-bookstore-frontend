import { api } from "@/services/axios";

export async function loginAction(data: any) {
  try {
    const res = await api.post("/auth/login", data);

    return res;
  } catch (error) {
    console.log(error);
  }
}
