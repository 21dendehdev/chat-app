import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// GENERATE JWT TOKEN
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, telephone, password } = req.body;

    // CHECK IF USER EXISTS
    const userExists = await User.findOne({ telephone });

    if (userExists) {
      return res.status(400).json({
        message: "Telephone already registered",
      });
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // CREATE USER
    const user = await User.create({
      name,
      telephone,
      password: hashedPassword,
    });

    // RESPONSE
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        telephone: user.telephone,
      },

      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { telephone, password } = req.body;

    // FIND USER
    const user = await User.findOne({ telephone });

    // CHECK USER
    if (!user) {
      return res.status(401).json({
        message: "Invalid telephone or password",
      });
    }

    // COMPARE PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid telephone or password",
      });
    }

    // SUCCESS RESPONSE
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        telephone: user.telephone,
      },

      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};