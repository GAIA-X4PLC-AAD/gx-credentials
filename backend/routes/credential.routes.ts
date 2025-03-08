import express from "express";
import {
  CompanyCredentialController,
  EmployeeCredentialController,
} from "../controllers/credential.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
router.use(authMiddleware);

router.post("/", (req, res) => {
  const { type } = req.body;
  if (type === "employee") {
    EmployeeCredentialController.create(req, res);
  } else if (type === "company") {
    CompanyCredentialController.create(req, res);
  } else {
    res.status(400).send({ message: "Invalid credential type" });
  }
});

// Employee credential routes
router.get("/employee", EmployeeCredentialController.getAll);
router.get("/employee/:id", EmployeeCredentialController.getById);
router.post("/employee", EmployeeCredentialController.create);
router.put("/employee/:id", EmployeeCredentialController.update);
router.delete("/employee/:id", EmployeeCredentialController.delete);

// Company credential routes
router.get("/company", CompanyCredentialController.getAll);
router.get("/company/:id", CompanyCredentialController.getById);
router.post("/company", CompanyCredentialController.create);
router.put("/company/:id", CompanyCredentialController.update);
// company credentials are not to be deleted

export default router;
