import { upsertStreamUser } from "../lib/streamChat.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
export async function signup(req, res) {
  const { email, password, fullName, gender } = req.body;
  try {
    if (!email || !password || !fullName || !gender) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password should be more than or equal to 6 letters",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User with this Email already exists" });
    let randomPFP;
    if (gender === "male") {
      randomPFP = `https://avatar.iran.liara.run/public/boy`;
    } else {
      randomPFP = `https://avatar.iran.liara.run/public/girl`;
    }
    const newUser = await User.create({
      email,
      password,
      fullName,
      gender,
      profilePic: randomPFP,
    });
    try {
      console.log("User payload:", {
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for the user ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user", error);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpsOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("error in signup Controller", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
export async function signin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await existingUser.matchPass(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpsOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({ success: true, user: existingUser });
  } catch (error) {
    console.log("error in signin Controller", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
export function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "logout successful", success: true });
}
