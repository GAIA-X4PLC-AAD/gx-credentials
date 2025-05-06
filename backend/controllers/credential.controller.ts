import { Request, Response } from "express";
import { CredentialRepository } from "../repositories/credential";
import addOffer from "../lib/vci";

type CredentialType = "employee" | "company";

export const CredentialController = {
  get: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Credential ID is required" });
        return;
      }

      const credential = await CredentialRepository.get(id);

      if (!credential || credential.holder_pkh !== req.user?.pkh) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // precompute the takeout link to make the frontend simpler
      res.status(200).json(addOffer(credential));
    } catch (error) {
      console.error("Error fetching credential by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getByHolder: async (req: Request, res: Response): Promise<void> => {
    try {
      const { pkh } = req.params;
      if (pkh !== req.user?.pkh) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const [employeeCredential, companyCredential] = await Promise.all([
        CredentialRepository.getByHolder("employee_credentials", pkh),
        CredentialRepository.getByHolder("company_credentials", pkh),
      ]);

      const credentials = [
        ...(employeeCredential || []),
        ...(companyCredential || []),
      ];

      if (!credentials) {
        res.status(404).json({ message: "No credentials found" });
        return;
      }

      res.status(200).json(credentials.map(addOffer));
    } catch (error) {
      console.error("Error fetching credential by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllCompanies: async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials = await CredentialRepository.getAll(
        "company_credentials",
      );

      if (!credentials) {
        res.status(404).json({ message: "No companies found" });
        return;
      }

      const companies = credentials
        .filter((cred) => cred.revoked === false)
        .map((cred) => ({
          name: cred.name,
          pkh: cred.issuer_pkh,
        }));

      res.status(200).json(companies);
    } catch (error) {
      console.error(`Error fetching all companies`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { holder_pkh, type, ...credentialData } = req.body;

      if (!holder_pkh) {
        res.status(400).json({ message: "Holder public key hash is required" });
        return;
      }

      if (!type) {
        res.status(400).json({ message: "Credential type is required" });
        return;
      }

      if (!(req.user?.isRegistrar || req.user?.companyCredential)) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const credentialPayload = {
        holder_pkh,
        revoked: false,
        ...credentialData,
      };

      switch (type as CredentialType) {
        case "employee":
          await CredentialRepository.create(
            "employee_credentials",
            credentialPayload,
          );
          break;
        case "company":
          await CredentialRepository.create(
            "company_credentials",
            credentialPayload,
          );
          break;
        default:
          res.status(400).json({ message: "Invalid credential type" });
          return;
      }

      res.status(201).json({ message: "Credential created successfully" });
    } catch (error) {
      console.error("Error creating credential:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const credential = await CredentialRepository.get(id);

      if (!credential || credential.issuer_pkh !== req.user?.pkh) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { holder_pkh, ...credentialData } = req.body;

      if (!id) {
        res.status(400).json({ message: "Credential ID is required" });
        return;
      }

      // Try to update in both databases
      const [employeeUpdated, companyUpdated] = await Promise.all([
        CredentialRepository.update(
          "employee_credentials",
          id,
          credentialData,
        ).catch(() => false),
        CredentialRepository.update(
          "company_credentials",
          id,
          credentialData,
        ).catch(() => false),
      ]);

      if (!employeeUpdated && !companyUpdated) {
        res.status(404).json({ message: "Credential not found" });
        return;
      }

      res.status(200).json({ message: "Credential updated successfully" });
    } catch (error) {
      console.error("Error updating credential:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
