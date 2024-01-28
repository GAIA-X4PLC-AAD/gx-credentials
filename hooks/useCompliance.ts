import { useContext, useState } from "react";
import axios from "axios";
import { environment } from "@/env";
import { useErrorHandler } from "@/hooks/useError";
import {
  ComplianceFormat,
  CredentialFormats,
  CredentialOffersApiResponseData,
} from "@/sharedTypes";
import { VDocument } from "@/models/document";
import { ClearingHousesContext } from "@/contexts/ClearingHousesContext";

interface UseComplianceReturnValues {
  verifyWithCompliance: (
    vcId: string | undefined,
    verifiablePresentation: VDocument,
  ) => Promise<CredentialOffersApiResponseData | undefined>;
  isLoading: boolean;
  outputFormat: ComplianceFormat | undefined;
  outputFormats: ComplianceFormat[];
  setOutputFormat: (format: ComplianceFormat) => void;
}

export const useCompliance = (): UseComplianceReturnValues => {
  const [isLoading, setIsLoading] = useState(false);
  const outputFormats: ComplianceFormat[] = Object.values(CredentialFormats);
  const [outputFormat, setOutputFormat] = useState<ComplianceFormat>();
  const { errorHandler } = useErrorHandler();
  const { selectedClearingHouse } = useContext(ClearingHousesContext);

  const verifyWithCompliance = async (
    vcId: string | undefined,
    verifiablePresentation: VDocument,
  ): Promise<CredentialOffersApiResponseData | undefined> => {
    try {
      setIsLoading(true);
      const headers = {
        accept: outputFormat || CredentialFormats.JSON,
      };

      const { data } = await axios.post<CredentialOffersApiResponseData>(
        environment(window.location.href).requestComplianceEndpoint(vcId),
        {
          verifiablePresentation,
          clearingHouse: selectedClearingHouse.complianceEndpoint,
        },
        { headers },
      );

      return data;
    } catch (e: any) {
      if (
        typeof e.response?.data?.message === "object" &&
        !!e.response?.data?.message.results
      ) {
        errorHandler(e, e.response?.data?.message.results.join(", "));
      } else {
        errorHandler(
          e,
          e.response?.data?.message ||
            e.message ||
            "Error while calling the compliance",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyWithCompliance,
    isLoading,
    outputFormats,
    outputFormat,
    setOutputFormat,
  };
};
