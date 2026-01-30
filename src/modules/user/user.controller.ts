import { Request, Response } from "express";
import { UserService } from "./user.service";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await UserService.createUserService({ ...rest, password: hashedPassword });

    res.status(201).json({ success: true, message: "User registered!", data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await UserService.loginUserService(req.body);
    const isMatched = await bcrypt.compare(req.body.password, user.password as string);
    if (!isMatched) throw new Error("Invalid password!");

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.status(200).json({ success: true, token, user });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userPayload = (req as any).user;
    const identifier = userPayload.id || userPayload.email;

    const result = await UserService.getMyProfile(identifier);

    if (!result) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(401).json({ success: false, message: "Unauthorized!" });
  }
};
const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await UserService.updateUserStatusInDB(id as string, status);
    res.status(200).json({ success: true, message: "User status updated!", data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllUsersService;
    res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
export const UserController = {
  registerUser,
  loginUser,
  getMyProfile,
  getAllUsers,
  updateUserStatus

};