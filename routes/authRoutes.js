// This file defines the authentication routes for the application, including login and registration endpoints. It imports the necessary controller functions from the authController and sets up the Express router to handle POST requests for both login and registration. The router is then exported for use in the main server file.

import express from "express";

import {
  loginUser,
  registerUser,
} from "../controllers/authController.js";

const router = express.Router();

// LOGIN
router.post("/login", loginUser);

// REGISTER
router.post("/register", registerUser);


export default router;