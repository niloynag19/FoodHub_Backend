import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { postRouter } from "./modules/post/post.router";
import cors from 'cors'
import { userRoutes } from "./modules/user/user.router";
import { CategoryRoutes } from "./modules/category/category.routes";


const app=express();

app.use(cors({
    origin:process.env.APP_URL || "http://localhost:3000",
    credentials:true
}))
app.use(express.json());
app.use("/api/users", userRoutes);

app.use("/api/categories", CategoryRoutes);

app.use("/posts",postRouter)


app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/",(req,res)=>{
    res.send("Hello world")
})


export default app;