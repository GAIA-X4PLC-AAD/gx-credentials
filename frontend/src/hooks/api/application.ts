import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { APIResponse, baseURL } from "./base";

import {
  Application,
  ApplicationStatus,
  ApplicationType,
  CreateApplication,
} from "@/model/application";

type GetApplicationsProps = {
  pkh: string;
  type?: ApplicationType;
};

export const useGetApplicationsByApplicant = ({
  type,
  pkh,
}: Partial<GetApplicationsProps>) => {
  const fetchApplication = async () => {
    const url = new URL(`application/applicant/${pkh}`, baseURL);
    if (type) url.searchParams.append("type", type);

    return fetch(url, {
      mode: "cors",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.error || data.message) return [];
        return data as Application[];
      });
  };

  const { isLoading, isError, error, data, refetch, isFetching } = useQuery({
    queryKey: ["getApplicationByApplicant", pkh],
    queryFn: fetchApplication,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
    enabled: !!pkh,
  });

  return {
    isLoading,
    isError,
    error,
    applications: data,
    refetch,
    isFetching,
  };
};

export const useGetApplicationsForIssuer = ({ pkh }: { pkh: string }) => {
  const fetchApplication = async () => {
    const url = new URL(`application/issuer/${pkh}`, baseURL);

    return fetch(url, {
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.error || data.message) return [];
        return data as Application[];
      });
  };

  const { isLoading, isError, error, data, refetch, isFetching } = useQuery({
    queryKey: ["getApplicationsForIssuer", pkh],
    queryFn: fetchApplication,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
    enabled: !!pkh,
    retry: false,
  });

  return {
    isLoading,
    isError,
    error,
    applicationsForIssuer: data,
    refetch,
    isFetching,
  };
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  const createApplication = async (application: CreateApplication) => {
    const url = new URL("application", baseURL);

    return fetch(url, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application),
    }).then(res => res.json() as Promise<APIResponse<Application>>);
  };

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["getApplicationById"],
      });
    },
  });
};

type UpdateApplicationProps = {
  id: string;
  type: ApplicationType;
  status: ApplicationStatus;
  metadata?: string;
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  const updateApplication = async ({
    status,
    type,
    metadata,
    id,
  }: UpdateApplicationProps) => {
    const url = new URL(`application/${id}`, baseURL);
    url.searchParams.append("type", type);

    return fetch(url, {
      method: "PUT",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, metadata }),
    }).then(res => res.json() as Promise<APIResponse<Application>>);
  };

  return useMutation({
    mutationFn: updateApplication,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["getApplicationByApplicant"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["getApplicationsForIssuer"],
      });
    },
  });
};
