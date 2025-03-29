import { Request, Response } from "express";
import { ApplicationStatus } from "../db/schema";
import { ApplicationRepository } from "../repositories/application";

export const ApplicationController = {
  /**
   * Get all applications of specified type.
   */
  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const type = req.query.type as "employee" | "company";
      const validTypes = ["employee", "company"] as const;

      if (type && !validTypes.includes(type)) {
        res.status(400).json({ message: "Invalid application type" });
        return;
      }

      const applications = await ApplicationRepository.getAll(type);

      if (!applications || applications.length === 0) {
        res.status(404).json({ message: "No applications found" });
        return;
      }

      res.status(200).json(applications);
    } catch (error) {
      console.error(`Error fetching ${req.query.type} applications:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Get applications by public key hash.
   */
  getByPkh: async (req: Request, res: Response): Promise<void> => {
    try {
      const { pkh } = req.params;
      const type = req.query.type as "employee" | "company";
      const company = req.query.company as string;

      if (!pkh) {
        res.status(400).json({ message: "Public key hash is required" });
        return;
      }

      const validTypes = ["employee", "company"] as const;
      if (type && !validTypes.includes(type)) {
        res.status(400).json({ message: "Invalid application type" });
        return;
      }

      const applications = await ApplicationRepository.getByPkh(pkh, type);

      if (!applications || applications.length === 0) {
        res.status(404).json({ message: "No applications found" });
        return;
      }

      // if company name given
      if (type === "employee" && company) {
        const employeeApps = applications.filter(
          (app) => app.metadata?.companyName === company
        );
        if (employeeApps.length === 0) {
          res.status(404).json({
            message: `No employee applications for the company name ${company} found.`,
          });
          return;
        }
        res.status(200).json(employeeApps);
        return;
      }

      res.status(200).json(applications);
    } catch (error) {
      console.error(`Error fetching application by ID:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Create a new application.
   */
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { pkh, metadata, type } = req.body;
      if (!type || !["employee", "company"].includes(type)) {
        res
          .status(400)
          .json({ message: "Valid type query parameter is required" });
        return;
      }

      if (!pkh) {
        res.status(400).json({ message: "ID is required" });
        return;
      }

      const newApp = await ApplicationRepository.create(type, {
        pkh,
        status: ApplicationStatus.Open,
        metadata,
      });

      res.status(201).json({
        message: "Application created successfully",
        application: newApp,
      });
    } catch (error) {
      console.error(`Error creating application:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Update an application.
   */
  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const type = req.query.type as "employee" | "company";
      if (!type || !["employee", "company"].includes(type)) {
        res
          .status(400)
          .json({ message: "Valid type query parameter is required" });
        return;
      }

      const { id } = req.params;
      const { status, metadata } = req.body;

      if (!id) {
        res.status(400).json({ message: "ID is required" });
        return;
      }

      if (!status && !metadata) {
        res
          .status(400)
          .json({ message: "At least one field is required for update" });
        return;
      }

      const application = await ApplicationRepository.update(
        type,
        id,
        status,
        metadata
      );

      if (!application) {
        res.status(404).json({ message: "Application not found" });
        return;
      }

      res.status(200).json({ message: "Application updated." });
    } catch (error) {
      console.error(`Error updating application:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Delete an application.
   */
  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const type = req.query.type as "employee" | "company";
      if (!type || !["employee", "company"].includes(type)) {
        res
          .status(400)
          .json({ message: "Valid type query parameter is required" });
        return;
      }

      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "ID is required" });
        return;
      }

      if (type === "company") {
        res
          .status(400)
          .json({ message: "Company applications cannot be deleted" });
        return;
      }

      const deletedApp = await ApplicationRepository.delete(type, id);

      if (!deletedApp) {
        res.status(404).json({ message: "Application not found" });
        return;
      }

      res.status(200).json({
        message: "Application deleted successfully",
        application: deletedApp,
      });
    } catch (error) {
      console.error(`Error deleting application:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
