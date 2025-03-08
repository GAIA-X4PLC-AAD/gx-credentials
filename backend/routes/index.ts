import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "GX Credentials API Server" });
});

export default router;
