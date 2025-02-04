import { Request, Response } from "express";
import { ApplicationRepository } from "../repositories/application";
import { ApplicationStatus } from "../db/schema";

export const EmployeeApplicationController = {
  /**
   * Get all employee applications.
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const applications =
        await ApplicationRepository.getAllEmployeeApplications();

      if (!applications) {
        res.status(404).json({ message: "Applications not found" });
      }

      res.status(200).json(applications);
    } catch (error) {
      console.error("Error fetching employee applications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Get a single employee application by ID.
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const application =
        await ApplicationRepository.getEmployeeApplicationByPkh(id);

      if (!application) {
        res.status(404).json({ message: "Application not found" });
      }

      res.status(200).json(application);
    } catch (error) {
      console.error("Error fetching employee application by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Create a new employee application.
   */
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { pkh, metadata } = req.body;

      if (!pkh) {
        res.status(400).json({ message: "ID is required" });
      }

      await ApplicationRepository.createCompanyApplication({
        pkh,
        status: ApplicationStatus.Open,
        metadata,
      });
      res.status(201).json({ message: "Application created successfully" });
    } catch (error) {
      console.error("Error creating employee application:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Update an employee application.
   */
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, metadata } = req.body;

      if (!status && !metadata) {
        res
          .status(400)
          .json({ message: "At least one field is required for update" });
      }

      const application = await ApplicationRepository.updateEmployeeApplication(
        id,
        status,
        metadata
      );

      if (!application) {
        res.status(404).json({ message: "Application not found" });
      }

      res.status(200).json(application);
    } catch (error) {
      console.error("Error updating employee application status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Delete an employee application.
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const application = await ApplicationRepository.deleteEmployeeApplication(
        id
      );

      if (!application) {
        res.status(404).json({ message: "Application not found" });
      }

      res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error("Error deleting employee application:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export const CompanyApplicationController = {
  /**
   * Get all company applications.
   *
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const applications =
        await ApplicationRepository.getAllCompanyApplications();
      res.status(200).json(applications);
    } catch (error) {
      console.error("Error fetching company applications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Get a single company application by ID.
   */
  getById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const application =
        await ApplicationRepository.getCompanyApplicationByPkh(id);

      if (!application) {
        res.status(404).json({ message: "Application not found" });
      }

      res.status(200).json(application);
    } catch (error) {
      console.error("Error fetching company application by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Create a new company application.
   */
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { pkh, metadata } = req.body;

      if (!pkh) {
        res.status(400).json({ message: "ID is required" });
      }

      await ApplicationRepository.createCompanyApplication({
        pkh,
        status: ApplicationStatus.Open,
        metadata,
      });
      res.status(201).json({ message: "Application created successfully" });
    } catch (error) {
      console.error("Error creating company application:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Update a company application.
   */
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, metadata } = req.body;

      if (!status && !metadata) {
        res
          .status(400)
          .json({ message: "At least one field is required for update" });
      }

      const application = await ApplicationRepository.updateCompanyApplication(
        id,
        status,
        metadata
      );

      if (!application) {
        res.status(404).json({ message: "Application not found" });
      }

      res.status(200).json(application);
    } catch (error) {
      console.error("Error updating company application status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Delete a company application.
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const application = await ApplicationRepository.deleteCompanyApplication(
        id
      );

      if (!application) {
        res.status(404).json({ message: "Application not found" });
      }

      res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error("Error deleting company application:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
