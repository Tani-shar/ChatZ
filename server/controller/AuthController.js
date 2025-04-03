import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";

// Token expiration time (1 hour in seconds)
const TOKEN_AGE = 3600;



const createToken = (email, userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }
  return jwt.sign(
    { email, userId },
    process.env.JWT_SECRET,
    {
      expiresIn: TOKEN_AGE,
    }
  );
};

export const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    
    // Validate input
    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      fullName,
      email,
      password,
    });

    const token = createToken(user.email, user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: TOKEN_AGE * 1000,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
      }
    };


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create and set JWT token
    const token = createToken(user.email, user._id);

    // Set cookie with JWT token
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: TOKEN_AGE * 1000,
    });

    // Send successful response with user data
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileSetup: user.profileSetup,
      },
    });
    
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      profileSetup: user.profileSetup,
    });
  } catch (error) {
    console.error("Get User Info Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { firstName, lastName } = req.body;
    const profileImage = req.file;

    if (!firstName?.trim() || !lastName?.trim()) {
      return res.status(400).json({ message: "Full name is required" });
    }

    let imageUrl = null;
    if (profileImage) {
      imageUrl = `data:${profileImage.mimetype};base64,${profileImage.buffer.toString("base64")}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: `${firstName} ${lastName}`,
        image: imageUrl, // Store image URL in the database
        profileSetup: true,
      },
      { new: true }
    );

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}; 

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1, // Set expiration date to the past
    });
    // res.clearCookie("jwt");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};