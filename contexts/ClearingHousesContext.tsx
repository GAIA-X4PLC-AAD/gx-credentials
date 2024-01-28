import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useErrorHandler } from "@/hooks/useError";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { environment } from "@/env";

type GaiaXDeploymentPath = "v1" | "main" | "development";
export type ClearingHouse = {
  name: string;
  complianceEndpoint: string;
  registryEndpoint: string;
  registrationNotaryEndpoint: string;
};

type ClearingHousesContextProps = {
  providers: string[];
  clearingHouses: ClearingHouse[];
  gxDeploymentPaths: GaiaXDeploymentPath[] | false;
  selectedClearingHouse: ClearingHouse;
  setSelectedClearingHouse: (clearingHouse: ClearingHouse) => void;
  getClearingHouseByName: (name: string) => ClearingHouse | undefined;
  selectedGxDeploymentPath: GaiaXDeploymentPath;
  setSelectedGxDeploymentPath: (version: GaiaXDeploymentPath) => void;
};

type ClearingHouseStored = {
  clearingHouse: ClearingHouse;
  gxVersion: GaiaXDeploymentPath;
};
const localStorageKey = "clearingHouse";

export const loadBalancedClearingHouse: ClearingHouse = {
  name: "any",
  complianceEndpoint: "compliance.gaia-x.eu/v1",
  registryEndpoint: "registry.gaia-x.eu/v1",
  registrationNotaryEndpoint: "registrationnumber.notary.gaia-x.eu/v1",
};

export const ClearingHousesContext = createContext<ClearingHousesContextProps>({
  providers: [],
  clearingHouses: [],
  gxDeploymentPaths: false,
  selectedClearingHouse: loadBalancedClearingHouse,
  setSelectedClearingHouse: () => null,
  getClearingHouseByName: () => loadBalancedClearingHouse,
  selectedGxDeploymentPath: "v1",
  setSelectedGxDeploymentPath: () => null,
});

const fetchClearingHouses = async () => {
  const getClearingHousesURI = environment(
    window.location.href,
  ).requestClearingHousesEndpoint;
  const { data } = await axios.get(getClearingHousesURI);
  return data;
};

export const ClearingHousesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { errorHandler } = useErrorHandler();

  const [clearingHouses, setClearingHouses] = useState<ClearingHouse[]>([]);
  const [gxDeploymentPaths, setGxDeploymentPaths] = useState<
    GaiaXDeploymentPath[] | false
  >(false);
  const [selectedClearingHouse, setSelectedClearingHouse] =
    useState<ClearingHouse>(loadBalancedClearingHouse);
  const [selectedGxDeploymentPath, setSelectedGxDeploymentPath] =
    useState<GaiaXDeploymentPath>("v1");

  const { data } = useQuery({
    queryKey: ["clearingHouses"],
    queryFn: fetchClearingHouses,
    // onError: (error: Error) =>
    //   errorHandler(error, "Could not fetch Clearing Houses list"),
    initialData: {
      registry: [],
      compliance: [],
      "registration-notary": [],
    },
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const getClearingHouseByName = (name: string): ClearingHouse | undefined => {
    return clearingHouses.find(
      (clearingHouse: ClearingHouse) => clearingHouse.name === name,
    );
  };

  const clearingHouseProviders = useMemo(() => {
    const getDomainName = (clearingHouseBaseUrl: string): string => {
      const splitUrl = clearingHouseBaseUrl.split(".");
      return splitUrl[splitUrl.length - 2];
    };

    const urls: string[] = Object.values(data)[0] as string[];
    return urls.map(getDomainName);
  }, [data]);

  const clearingHouseProvidersWithLoadBalancer = [
    "any",
    ...clearingHouseProviders,
  ];

  useEffect(() => {
    const findEndpointWithProviderAndSetEnvironment = (
      data: string[],
      provider: string,
    ) => {
      let endpoint = data.find((endpoint: string) =>
        endpoint.includes(provider),
      );
      if (
        endpoint?.includes("gaia-x") &&
        selectedClearingHouse.name === "gaia-x"
      ) {
        endpoint = endpoint.split("/")[0] + `/${selectedGxDeploymentPath}`;
      }
      return endpoint || "";
    };

    const clearingHouses: ClearingHouse[] = [
      loadBalancedClearingHouse,
      ...clearingHouseProviders.map((clearingHouseProvider: string) => ({
        name: clearingHouseProvider,
        complianceEndpoint: findEndpointWithProviderAndSetEnvironment(
          data.compliance,
          clearingHouseProvider,
        ),
        registryEndpoint: findEndpointWithProviderAndSetEnvironment(
          data.registry,
          clearingHouseProvider,
        ),
        registrationNotaryEndpoint: findEndpointWithProviderAndSetEnvironment(
          data["registration-notary"],
          clearingHouseProvider,
        ),
      })),
    ];

    setClearingHouses(clearingHouses);
  }, [selectedGxDeploymentPath, clearingHouseProviders]);

  const setSelectedClearingHouseAndSave = (clearingHouse: ClearingHouse) => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        clearingHouse: clearingHouse,
        gxVersion: selectedGxDeploymentPath,
      }),
    );
    setSelectedClearingHouse(clearingHouse);
  };

  const setSelectedGxDeploymentPathAndSave = (version: GaiaXDeploymentPath) => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        clearingHouse: selectedClearingHouse,
        gxVersion: version,
      }),
    );
    setSelectedGxDeploymentPath(version);
  };

  useEffect(() => {
    if (!!clearingHouses.length && selectedClearingHouse.name === "gaia-x") {
      setGxDeploymentPaths(["v1", "main", "development"]);
    } else {
      setGxDeploymentPaths(false);
    }
  }, [selectedClearingHouse, clearingHouses]);

  useEffect(() => {
    if (!!gxDeploymentPaths && selectedClearingHouse.name === "gaia-x") {
      const gxClearingHouse = getClearingHouseByName("gaia-x");
      if (gxClearingHouse) setSelectedClearingHouse(gxClearingHouse);
    }
  }, [selectedClearingHouse, gxDeploymentPaths]);

  useEffect(() => {
    const clearingHouseStored = localStorage.getItem(localStorageKey);
    if (clearingHouseStored) {
      const parsedClearingHouseStored: ClearingHouseStored =
        JSON.parse(clearingHouseStored);
      setSelectedClearingHouse(parsedClearingHouseStored.clearingHouse);
      setSelectedGxDeploymentPath(parsedClearingHouseStored.gxVersion);
    }
  }, []);

  return (
    <ClearingHousesContext.Provider
      value={{
        providers: clearingHouseProvidersWithLoadBalancer,
        clearingHouses,
        gxDeploymentPaths,
        selectedClearingHouse,
        setSelectedClearingHouse: setSelectedClearingHouseAndSave,
        getClearingHouseByName,
        selectedGxDeploymentPath,
        setSelectedGxDeploymentPath: setSelectedGxDeploymentPathAndSave,
      }}
    >
      {children}
    </ClearingHousesContext.Provider>
  );
};
