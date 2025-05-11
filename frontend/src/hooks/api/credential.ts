import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { APIResponse, baseURL } from "./base";

import {
  CreateCredential,
  Credential,
  CredentialType,
} from "@/model/credential";

type GetCredentialsByPkhProps = {
  pkh: string;
  type?: CredentialType;
};

type CompanyEntry = {
  pkh: string;
  name: string;
};

export const useGetCredentialsByPkh = ({
  pkh,
  type,
}: GetCredentialsByPkhProps) => {
  const fetchCredential = async () => {
    if (!pkh) return [];
    const url = new URL(`credential/holder/${pkh}`, baseURL);
    if (type) url.searchParams.append("type", type);
    return fetch(url, {
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error || data.message) return [];
        return data as Credential[];
      });
  };

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["getCredentialsByPkh", type, pkh],
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

export const useGetAllCompanies = () => {
  const fetchCompanies = async () => {
    const url = new URL(`credential/all/companies`, baseURL);
    return fetch(url, {
      mode: "cors",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error || data.message) return [];
        return data as CompanyEntry[];
      });
  };

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["useGetAllCompanies"],
    queryFn: fetchCompanies,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });

  return {
    isLoading,
    isError,
    companies: data,
    refetch,
    isFetching,
  };
};

export const useCreateCredential = () => {
  const queryClient = useQueryClient();

  const createCredential = async (credential: CreateCredential) => {
    const url = new URL("credential", baseURL);
    return fetch(url, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    }).then(res => res.json() as Promise<APIResponse<Credential>>);
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

type UpdateCredentialProps = {
  credential: Credential;
};

export const useUpdateCredential = () => {
  const queryClient = useQueryClient();

  const updateCredential = async ({ credential }: UpdateCredentialProps) => {
    const url = new URL(`credential/${credential.id}`, baseURL);
    return fetch(url, {
      method: "PUT",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    }).then(res => res.json() as Promise<APIResponse<Credential>>);
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
