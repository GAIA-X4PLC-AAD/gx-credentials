//TODO: replace hardcoded url
export const baseURL = "http://localhost:8080/api/";

export type APIResponse<T> = {
  [key: string]: T;
} & {
  message?: string;
};
