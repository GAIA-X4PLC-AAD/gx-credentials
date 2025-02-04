import express from "express";
import {
  EmployeeApplicationController,
  CompanyApplicationController,
} from "../controllers/application.controller";

const router = express.Router();

router.post("/", (req, res) => {
  const { type } = req.body;

  if (type === "employee") {
    EmployeeApplicationController.create(req, res);
  } else if (type === "company") {
    CompanyApplicationController.create(req, res);
  } else {
    res.status(400).send({ error: "Invalid application type" });
  }
});

// Employee application routes
router.get("/employee", EmployeeApplicationController.getAll);
router.get("/employee/:id", EmployeeApplicationController.getById);
router.post("/employee", EmployeeApplicationController.create);
router.put("/employee/:id", EmployeeApplicationController.update);
router.delete("/employee/:id", EmployeeApplicationController.delete);

// Company application routes
router.get("/company", CompanyApplicationController.getAll);
router.get("/company/:id", CompanyApplicationController.getById);
router.post("/company", CompanyApplicationController.create);
router.put("/company/:id", CompanyApplicationController.update);
// company applications are not to be deleted

export default router;
