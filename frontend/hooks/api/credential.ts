import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIResponse, baseURL } from "./base";
import {
  CreateCredential,
  Credential,
  CredentialType,
} from "@/model/credential";

type GetCredentialsProps = {
  type: CredentialType;
};

export const useGetCredentials = ({ type }: GetCredentialsProps) => {
  const fetchCredentials = async () => {
    return fetch(`${baseURL}/credential/${type}`, {
      mode: "cors",
    }).then((res) => res.json() as Promise<Credential[]>);
  };

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["getCredentials", type],
    queryFn: fetchCredentials,
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

type GetCredentialByIdProps = GetCredentialsProps & {
  id: string;
};

export const useGetCredentialById = ({ type, id }: GetCredentialByIdProps) => {
  const fetchCredential = async () => {
    return fetch(`${baseURL}/credential/${type}/${id}`, {
      mode: "cors",
    }).then((res) => res.json() as Promise<Credential>);
  };

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["getCredentialById", type, id],
    queryFn: fetchCredential,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });

  return {
    isLoading,
    isError,
    credential: data,
    refetch,
    isFetching,
  };
};

export const useCreateCredential = () => {
  const queryClient = useQueryClient();

  const createCredential = async (credential: CreateCredential) => {
    return fetch(`${baseURL}/credential/${credential.type}`, {
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
    return fetch(`${baseURL}/credential/${type}/${credential.holder_pkh}`, {
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

type DeleteCredentialProps = GetCredentialByIdProps;

export const useDeleteCredential = () => {
  const queryClient = useQueryClient();

  const deleteCredential = async ({ type, id }: DeleteCredentialProps) => {
    return fetch(`${baseURL}/credential/${type}/${id}`, {
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
