import express from "express";

const router = express.Router();

router.get("/user/:id", (req, res) => {
  res.json([]);
});

export default router;