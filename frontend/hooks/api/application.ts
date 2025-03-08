import {
  Application,
  ApplicationStatus,
  ApplicationType,
  CreateApplication,
} from "@/model/application";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { APIResponse, baseURL } from "./base";

type GetApplicationsProps = {
  type?: ApplicationType;
};

export const useGetApplications = ({ type }: GetApplicationsProps) => {
  const { data: session } = useSession();

  const fetchApplications = async () => {
    const url = new URL("application", baseURL);
    if (type) url.searchParams.append("type", type);

    return fetch(url, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.jwt}`,
      },
    }).then((res) => res.json() as Promise<Application[]>);
  };

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["getApplications", type],
    queryFn: fetchApplications,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });

  return {
    isLoading,
    isError,
    applications: data,
    refetch,
    isFetching,
  };
};

type GetApplicationByIdProps = GetApplicationsProps & {
  id: string;
};

export const useGetApplicationsByPkh = ({
  type,
  id,
}: Partial<GetApplicationByIdProps>) => {
  const { data: session } = useSession();

  const fetchApplication = async () => {
    const url = new URL(`application/${id}`, baseURL);
    if (type) url.searchParams.append("type", type);

    return fetch(url, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.jwt}`,
      },
    }).then((res) => res.json() as Promise<Application[]>);
  };

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["getApplicationById", type, id],
    queryFn: fetchApplication,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
    enabled: !!id,
  });

  return {
    isLoading,
    isError,
    applications: data,
    refetch,
    isFetching,
  };
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const createApplication = async (application: CreateApplication) => {
    const url = new URL("application", baseURL);

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.jwt}`,
      },
      body: JSON.stringify(application),
    }).then((res) => res.json() as Promise<APIResponse<Application>>);
  };

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["getApplications"],
      });
    },
  });
};

type UpdateApplicationProps = Required<GetApplicationByIdProps> & {
  status: ApplicationStatus;
  metadata?: string;
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.jwt}`,
      },
      body: JSON.stringify({ status, metadata }),
    }).then((res) => res.json() as Promise<APIResponse<Application>>);
  };

  return useMutation({
    mutationFn: updateApplication,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["getApplications"],
      });
    },
  });
};

type DeleteApplicationProps = {
  type: "employee"; // Only employee applications can be deleted
  id: string;
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const deleteApplication = async ({ type, id }: DeleteApplicationProps) => {
    const url = new URL(`application/${id}`, baseURL);
    url.searchParams.append("type", type);

    return fetch(url, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.user?.jwt}`,
      },
    }).then((res) => res.json() as Promise<APIResponse<Application>>);
  };

  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["getApplications"],
      });
    },
  });
};
