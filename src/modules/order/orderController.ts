import { Request, Response } from "express";
import { OrderService } from "./orderService";


const createOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const result = await OrderService.createOrderIntoDB(userId, req.body);
        res.status(201).json({ success: true, message: "Order placed successfully", data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getMyOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const result = await OrderService.getMyOrdersFromDB(userId, req.query);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const result = await OrderService.getAllOrdersFromDB(req.query, user.role, user.id);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const OrderController = {
    createOrder,
    getMyOrders,
    getAllOrders
};