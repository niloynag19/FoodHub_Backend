import express from "express";
import { createUser, getAllUsers } from "./user.controller";


const router = express.Router();

router.post("/create", createUser);
router.get("/", getAllUsers);

export const userRoutes= router;
