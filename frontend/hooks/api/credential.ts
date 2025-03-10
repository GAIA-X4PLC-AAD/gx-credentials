import {
  CreateCredential,
  Credential,
  CredentialType,
} from "@/model/credential";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIResponse, baseURL } from "./base";

export const useGetCredentials = () => {
  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["getCredentials"],
    queryFn: () => getAllCredentials(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });

  return {
    isLoading,
    isError,
    credentials: data,
    refetch,
    isFetching,
  };
};

type GetCredentialByIdProps = {
  type: CredentialType;
  id: string;
};

export const useGetCredentialsByPkh = ({
  type,
  id,
}: GetCredentialByIdProps) => {
  const fetchCredential = async () => {
    const url = new URL(`credential/${id}`, baseURL);
    url.searchParams.append("type", type);
    return getCredentialsByPkh(id, type);
  };

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["getCredentialByPkh", type, id],
    queryFn: fetchCredential,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });

  return {
    isLoading,
    isError,
    credentials: data,
    refetch,
    isFetching,
  };
};

export const useGetAllCredentialsByPkh = ({
  id: pkh,
}: Pick<GetCredentialByIdProps, "id">) => {
  const fetchCredential = async () => {
    return Promise.all([
      getCredentialsByPkh(pkh, "employee"),
      getCredentialsByPkh(pkh, "company"),
    ]).then(([employee, company]) => [...employee, ...company]);
  };

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["getAllCredentialsByPkh", pkh],
    queryFn: fetchCredential,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });

  return {
    isLoading,
    isError,
    credentials: data,
    refetch,
    isFetching,
  };
};

export const useCreateCredential = () => {
  const queryClient = useQueryClient();

  const createCredential = async (credential: CreateCredential) => {
    return fetch(`${baseURL}/credential`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    }).then((res) => res.json() as Promise<APIResponse<Credential>>);
  };

  return useMutation({
    mutationFn: createCredential,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["getCredentials"],
      });
    },
  });
};

type UpdateCredentialProps = GetCredentialByIdProps & {
  credential: Credential;
};

export const useUpdateCredential = () => {
  const queryClient = useQueryClient();

  const updateCredential = async ({
    credential,
    type,
  }: UpdateCredentialProps) => {
    const url = new URL(`credential/${credential.holder_pkh}`, baseURL);
    url.searchParams.append("type", type);
    return fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    }).then((res) => res.json() as Promise<APIResponse<Credential>>);
  };

  return useMutation({
    mutationFn: updateCredential,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["getCredentials"],
      });
    },
  });
};

type DeleteCredentialProps = Pick<GetCredentialByIdProps, "id">;

export const useDeleteCredential = () => {
  const queryClient = useQueryClient();

  const deleteCredential = async ({ id }: DeleteCredentialProps) => {
    return fetch(`${baseURL}/credential/${id}`, {
      method: "DELETE",
      mode: "cors",
    }).then((res) => res.json() as Promise<APIResponse<Credential>>);
  };

  return useMutation({
    mutationFn: deleteCredential,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["getCredentials"],
      });
    },
  });
};

// helpers
export const getAllCredentials = async (type?: CredentialType) => {
  const url = new URL("credential", baseURL);
  if (type) url.searchParams.append("type", type);
  return fetch(url, {
    mode: "cors",
  }).then((res) => res.json() as Promise<Credential[]>);
};

export const getCredentialsByPkh = async (
  pkh: string,
  type: CredentialType
) => {
  const url = new URL(`credential/${pkh}`, baseURL);
  url.searchParams.append("type", type);
  return fetch(url, {
    mode: "cors",
    headers: {
      Accept: "application/json",
    },
  }).then((res) => res.json() as Promise<Credential[]>);
};
