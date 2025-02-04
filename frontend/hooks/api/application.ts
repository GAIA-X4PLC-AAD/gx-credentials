import {
  Application,
  ApplicationStatus,
  ApplicationType,
  CreateApplication,
} from "@/model/application";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APIResponse, baseURL } from "./base";

type GetApplicationsProps = {
  type: ApplicationType;
};

export const useGetApplications = ({ type }: GetApplicationsProps) => {
  const fetchApplications = async () => {
    return fetch(`${baseURL}/application/${type}`, {
      mode: "cors",
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
    federations: data,
    refetch,
    isFetching,
  };
};

type GetApplicationByIdProps = GetApplicationsProps & {
  id: string;
};

export const useGetApplicationById = ({
  type,
  id,
}: GetApplicationByIdProps) => {
  const fetchApplication = async () => {
    return fetch(`${baseURL}/application/${type}/${id}`, {
      mode: "cors",
    }).then((res) => res.json() as Promise<Application>);
  };

  const { isLoading, isError, data, refetch, isFetching } = useQuery({
    queryKey: ["getApplicationById", type, id],
    queryFn: fetchApplication,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60_000,
  });

  return {
    isLoading,
    isError,
    application: data,
    refetch,
    isFetching,
  };
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  const createApplication = async (application: CreateApplication) => {
    return fetch(`${baseURL}/application/${application.type}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
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

type UpdateApplicationProps = GetApplicationByIdProps & {
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
    return fetch(`${baseURL}/application/${type}/${id}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
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

  const deleteApplication = async ({ type, id }: DeleteApplicationProps) => {
    return fetch(`${baseURL}/application/${type}/${id}`, {
      method: "DELETE",
      mode: "cors",
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
