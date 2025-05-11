import { Request, Response } from "express";
import { ApplicationStatus } from "../db/schema";
import { ApplicationRepository } from "../repositories/application";

export const ApplicationController = {
  getByApplicant: async (req: Request, res: Response): Promise<void> => {
    try {
      const { pkh } = req.params;
      const type = req.query.type as "employee" | "company";

      if (pkh !== req.user?.pkh) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (!pkh) {
        res.status(400).json({ message: "Public key hash is required" });
        return;
      }

      const validTypes = ["employee", "company"] as const;
      if (type && !validTypes.includes(type)) {
        res.status(400).json({ message: "Invalid application type" });
        return;
      }

      const applications = await ApplicationRepository.getByApplicant(
        pkh,
        type
      );

      if (!applications) {
        res.status(404).json({ message: "No applications found" });
        return;
      }

      res.status(200).json(applications);
    } catch (error) {
      console.error(`Error fetching application by ID:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getByIssuer: async (req: Request, res: Response): Promise<void> => {
    try {
      let { pkh } = req.params;

      if (!pkh) {
        res.status(400).json({ message: "Public key hash is required" });
        return;
      }

      if (pkh !== req.user?.pkh) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (req.user?.isRegistrar) {
        pkh = "registrar";
      }
      const applications = await ApplicationRepository.getByIssuer(pkh);

      if (!applications) {
        res.status(404).json({ message: "No applications found" });
        return;
      }

      res.status(200).json(applications);
    } catch (error) {
      console.error(`Error fetching application by ID:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

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

      if (pkh !== req.user?.pkh) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // making logic overall simpler by enforcing a max of 1 company VC per pkh
      if (req.user?.isRegistrar || req.user?.companyCredential) {
        res
          .status(400)
          .json({ message: "More than one issuing role not permitted" });
        return;
      }

      const newApp = await ApplicationRepository.create(type, {
        pkh,
        issuer_pkh: type === "company" ? "registrar" : metadata.companyAddress,
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

      const app = await ApplicationRepository.get(id);
      if (
        !app ||
        (type === "company" && app.issuer_pkh !== "registrar") ||
        (type === "employee" && app.issuer_pkh === "registrar")
      ) {
        res.status(400).json({ message: "Application not found" });
        return;
      }
      if (
        (type === "company" && !req.user?.isRegistrar) ||
        (type !== "company" && app.pkh !== req.user?.pkh)
      ) {
        res.status(401).json({ error: "Unauthorized" });
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
};
