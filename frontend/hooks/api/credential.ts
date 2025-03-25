import {
  CreateCredential,
  Credential,
  CredentialType,
} from "@/model/credential";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { APIResponse, baseURL } from "./base";

export const useGetCredentials = () => {
  const { data: session } = useSession();

  const getAllCredentials = async () => {
    const url = new URL("credential", baseURL);
    return fetch(url, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.jwt}`,
      },
    }).then((res) => res.json() as Promise<Credential[]>);
  };

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["getCredentials"],
    queryFn: getAllCredentials,
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
  id: string;
  type?: CredentialType;
};

export const useGetCredentialsByPkh = ({
  id,
  type,
}: GetCredentialByIdProps) => {
  const { data: session } = useSession();

  const fetchCredential = async () => {
    const url = new URL(`credential/did:pkh:tz:${id}`, baseURL);
    if (type) url.searchParams.append("type", type);
    return fetch(url, {
      mode: "cors",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session?.jwt}`,
      },
    }).then((res) => res.json() as Promise<Credential[]>);
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

export const useCreateCredential = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const createCredential = async (credential: CreateCredential) => {
    const url = new URL("credential", baseURL);
    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.jwt}`,
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
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const updateCredential = async ({
    credential,
    type,
  }: UpdateCredentialProps) => {
    const url = new URL(`credential/${credential.holder_pkh}`, baseURL);
    if (type) url.searchParams.append("type", type);
    return fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.jwt}`,
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
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const deleteCredential = async ({ id }: DeleteCredentialProps) => {
    return fetch(`${baseURL}/credential/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.jwt}`,
      },
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
