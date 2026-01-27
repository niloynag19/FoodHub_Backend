import express, { NextFunction, Request, Response } from 'express'


const router=express.Router();

const auth=()=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        console.log("Middle ware");
        next();
    }
}

router.post('/',auth(),(req:Request,res:Response)=>{
    res.send("Create a new post")
})

export const postRouter=router