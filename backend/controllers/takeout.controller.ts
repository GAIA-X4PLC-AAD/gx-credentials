import { Request, Response } from "express";
import { CredentialRepository } from "../repositories/credential";

export const TakeoutController = {
  wellKnownIssuer: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Credential ID is required" });
        return;
      }

      const credential = await CredentialRepository.get(id);

      const data = {
        credential_issuer: process.env.GLOBAL_SERVER_URL + "/api/vci/" + id,
        credential_endpoint:
          process.env.GLOBAL_SERVER_URL + "/api/vci/" + id + "/credential",
        credential_configurations_supported: {},
      };
      data.credential_configurations_supported[
        credential?.credential.payload.vc.type[1]
      ] = {
        format: "jwt_vc_json",
        credential_definition: {
          type: credential?.credential.payload.vc["type"],
        },
      };

      res.status(200).json(data);
    } catch (_error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  authorization: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Credential ID is required" });
        return;
      }

      const data = {
        issuer: process.env.GLOBAL_SERVER_URL + "/api/vci/" + id,
        token_endpoint:
          process.env.GLOBAL_SERVER_URL + "/api/vci/" + id + "/token",
        response_types_supported: ["vp_token", "id_token"],
        grant_types_supported: [
          "urn:ietf:params:oauth:grant-type:pre-authorized_code",
        ],
      };

      res.status(200).json(data);
    } catch (_error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  token: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Credential ID is required" });
        return;
      }

      const data = {
        // since we grant access based on knowing the internal credential id, the token does not matter
        access_token: id,
        token_type: "bearer",
        expires_in: 3600,
      };

      res.status(200).json(data);
    } catch (_error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  download: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "Credential ID is required" });
        return;
      }

      const credential = await CredentialRepository.get(id);
      if (!credential) {
        res.status(400).json({ message: "Credential not found" });
        return;
      }

      console.log(credential.jwt);
      res.status(200).json({ credential: credential.jwt });
    } catch (error) {
      console.error("Error fetching credential by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
