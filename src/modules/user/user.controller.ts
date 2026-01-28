import { Request, Response } from "express";
import { createUserService, getAllUsersService } from "./user.service";


// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await createUserService({ name, email, password });

    res.status(201).json({ user });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json({ users });
  } catch (err: any) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
