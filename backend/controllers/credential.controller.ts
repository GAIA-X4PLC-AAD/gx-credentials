import { Request, Response } from "express";
import { CredentialRepository } from "../repositories/credential";

// Controller for employee credentials
export const EmployeeCredentialController = {
  /**
   * Get all employee credentials.
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials =
        await CredentialRepository.getAllEmployeeCredentials();

      if (!credentials) {
        res.status(404).json({ message: "Credentials not found" });
      }

      res.status(200).json(credentials);
    } catch (error) {
      console.error("Error fetching employee credentials:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Get a single employee credential by ID.
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const credential = await CredentialRepository.getEmployeeCredential(id);

      if (!credential) {
        res.status(404).json({ message: "Credential not found" });
      }

      res.status(200).json(credential);
    } catch (error) {
      console.error("Error fetching employee credential by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Create a new employee credential.
   */
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { holder_pkh, ...credentialData } = req.body;

      if (!holder_pkh) {
        res.status(400).json({ message: "ID is required" });
      }

      await CredentialRepository.createEmployeeCredential({
        holder_pkh,
        ...credentialData,
      });
      res.status(201).json({ message: "Credential created successfully" });
    } catch (error) {
      console.error("Error creating employee credential:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Update an employee credential.
   */
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { holder_pkh, ...credentialData } = req.body;

      await CredentialRepository.updateEmployeeCredential(id, credentialData);
      res.status(200).json({ message: "Credential updated successfully" });
    } catch (error) {
      console.error("Error updating employee credential:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await CredentialRepository.deleteEmployeeCredential(id);
      res.status(200).json({ message: "Credential deleted successfully" });
    } catch (error) {
      console.error("Error deleting employee credential:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

// Controller for company credentials
export const CompanyCredentialController = {
  /**
   * Get all company credentials.
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials = await CredentialRepository.getAllCompanyCredentials();

      if (!credentials) {
        res.status(404).json({ message: "Credentials not found" });
      }

      res.status(200).json(credentials);
    } catch (error) {
      console.error("Error fetching company credentials:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Get a single company credential by ID.
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const credential = await CredentialRepository.getCompanyCredential(id);

      if (!credential) {
        res.status(404).json({ message: "Credential not found" });
      }

      res.status(200).json(credential);
    } catch (error) {
      console.error("Error fetching company credential by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Create a new company credential.
   */
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { holder_pkh, ...credentialData } = req.body;

      if (!holder_pkh) {
        res.status(400).json({ message: "ID is required" });
      }

      await CredentialRepository.createCompanyCredential({
        holder_pkh,
        ...credentialData,
      });
      res.status(201).json({ message: "Credential created successfully" });
    } catch (error) {
      console.error("Error creating company credential:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Update a company credential.
   */
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { holder_pkh, ...credentialData } = req.body;

      await CredentialRepository.updateCompanyCredential(id, credentialData);
      res.status(200).json({ message: "Credential updated successfully" });
    } catch (error) {
      console.error("Error updating company credential:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Delete a company credential.
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await CredentialRepository.deleteCompanyCredential(id);
      res.status(200).json({ message: "Credential deleted successfully" });
    } catch (error) {
      console.error("Error deleting company credential:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
