import express from "express";

import {
  loginUser,
  registerUser,
} from "../controllers/authController.js";

const router = express.Router();

// LOGIN
router.post("api/auth/login", loginUser);

// REGISTER
router.post("api/auth/register", registerUser);

export default router;