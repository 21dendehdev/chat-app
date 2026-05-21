// routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';
//import { protect } from '../middleware/authMiddleware.js'; // If you have auth middleware

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;