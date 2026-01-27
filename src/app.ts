import express from "express";
import { prisma } from "./lib/prisma";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { postRouter } from "./modules/post/post.router";

const app=express();
app.use(express.json());

app.use("/posts",postRouter)

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/",(req,res)=>{
    res.send("Hello world")
})


export default app;