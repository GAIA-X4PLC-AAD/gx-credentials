import { Request, Response } from "express";
import { CredentialRepository } from "../repositories/credential";

type CredentialType = "employee" | "company";

export const CredentialController = {
  /**
   * Get all credentials (both employee and company).
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const { type } = req.query;

      if (type) {
        if (!["employee", "company"].includes(type as string)) {
          res.status(400).json({ message: "Invalid credential type" });
          return;
        }

        const table = `${type}_credentials` as
          | "employee_credentials"
          | "company_credentials";
        const credentials = await CredentialRepository.getAll(table);
        res.status(200).json({ [type as string]: credentials || [] });
        return;
      }

      // if type is not given then fetch all credentials from both tables
      const [employeeCredentials, companyCredentials] = await Promise.all([
        CredentialRepository.getAll("employee_credentials"),
        CredentialRepository.getAll("company_credentials"),
      ]);

      const credentials = {
        employee: employeeCredentials || [],
        company: companyCredentials || [],
      };

      res.status(200).json(credentials);
    } catch (error) {
      console.error("Error fetching credentials:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Get credentials by public key hash (searches both employee and company).
   */
  getByPkh: async (req: Request, res: Response): Promise<void> => {
    try {
      const { pkh } = req.params;
      const [employeeCredential, companyCredential] = await Promise.all([
        CredentialRepository.getByPkh("employee_credentials", pkh),
        CredentialRepository.getByPkh("company_credentials", pkh),
      ]);

      const credential = employeeCredential || companyCredential;

      if (!credential) {
        res.status(404).json({ message: "Credential not found" });
        return;
      }

      res.status(200).json(credential);
    } catch (error) {
      console.error("Error fetching credential by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Create a new credential.
   */
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

      const credentialPayload = {
        holder_pkh,
        ...credentialData,
      };

      switch (type as CredentialType) {
        case "employee":
          await CredentialRepository.create(
            "employee_credentials",
            credentialPayload
          );
          break;
        case "company":
          await CredentialRepository.create(
            "company_credentials",
            credentialPayload
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

  /**
   * Update a credential.
   */
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
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
          credentialData
        ).catch(() => false),
        CredentialRepository.update(
          "company_credentials",
          id,
          credentialData
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

  /**
   * Delete a credential by ID (searches both employee and company).
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Credential ID is required" });
        return;
      }

      const [employeeDeleted, companyDeleted] = await Promise.all([
        CredentialRepository.delete("employee_credentials", id),
        CredentialRepository.delete("company_credentials", id),
      ]);

      if (!employeeDeleted && !companyDeleted) {
        res.status(404).json({ message: "Credential not found" });
        return;
      }

      res.status(200).json({ message: "Credential deleted successfully" });
    } catch (error) {
      console.error("Error deleting credential:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
