const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/*
-----------------------------------
REGISTER
-----------------------------------
*/

exports.register = async (req, res) => {
  try {

    let { name, telephone, password } = req.body;

    // normalize inputs
    name = name?.trim();
    telephone = telephone?.trim();
    password = password?.trim();

    console.log("REGISTER BODY:", req.body);

    // validation
    if (!name || !telephone || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ telephone });

    if (existingUser) {
      return res.status(400).json({
        message: "Telephone already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      telephone,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        telephone: user.telephone
      }
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);

    return res.status(500).json({
      message: error.message || "Server error"
    });
  }
};

/*
-----------------------------------
LOGIN
-----------------------------------
*/

exports.login = async (req, res) => {
  try {

    let { telephone, password } = req.body;

    telephone = telephone?.trim();
    password = password?.trim();

    console.log("LOGIN BODY:", req.body);

    if (!telephone || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const user = await User.findOne({ telephone });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        telephone: user.telephone
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      message: error.message || "Server error"
    });
  }
};