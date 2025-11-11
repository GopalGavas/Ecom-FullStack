import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUserController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    if (role && !["user", "seller"].includes(role)) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    const checkExistingUser = await User.findOne({
      email,
    });

    if (checkExistingUser) {
      return res
        .status(409)
        .json({ success: false, error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    if (!createUser) {
      return res.status(500).json({
        success: false,
        error: "Something went wrong while creating the user",
      });
    }

    const { password: _, ...userData } = createUser._doc;

    return res
      .status(201)
      .json({ message: "User created Successfully", userData });
  } catch (error) {
    console.error("Register Controller Error: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(403)
        .json({ success: false, error: "Invalid password" });
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "logged in successfully",
      name: existingUser.name,
    });
  } catch (error) {
    console.error("Login Controller Error: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Loged out successfully" });
  } catch (error) {
    console.error("Logout Controller Error: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getCurrentUserController = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Current User fetched Successfully",
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Get CurrentUser Controller Error: ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
