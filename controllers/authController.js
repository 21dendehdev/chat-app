// This file contains the authentication controller functions for handling user login and registration. It uses bcrypt for password hashing and JWT for token generation. The functions interact with the User model to perform database operations and return appropriate responses based on the success or failure of the authentication process.

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ MUST BE NAMED EXPORT


export const loginUser = async (req, res) => {
  try {
    const { telephone, password } = req.body;


    const user = await User.findOne({ telephone });
if (!/^[0-9]{8,15}$/.test(telephone)) {
  return res.status(400).json({ message: "Invalid phone number" });
}
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        telephone: user.telephone,
      },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ MUST ALSO BE NAMED EXPORT
export const registerUser = async (req, res) => {
  try {
    const { name, telephone, password } = req.body;

    const exists = await User.findOne({ telephone });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      telephone,
      password: hashed,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        telephone: user.telephone,
      },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};