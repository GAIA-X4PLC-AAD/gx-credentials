export const baseURL = import.meta.env.VITE_DIRECT_BACKEND_URL + "/api/";

export type APIResponse<T> = {
  [key: string]: T;
} & {
  message?: string;
};
