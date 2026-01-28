import { Request, Response } from "express";
import { postService } from "./post.service";

const getAllPost = async(req:Request,res:Response)=>{
    try {
        const result = await postService.getAllPost();
        res.status(200).json({
            result
        })
    } catch (error) {
        res.status(400).json({
            error:"Post creation failed",
            details:error
        })
    }
}

export const postController={
    getAllPost
}