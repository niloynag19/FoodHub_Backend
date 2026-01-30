import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors'

import { CategoryRoutes } from "./modules/category/category.routes";
import { MealRoutes } from "./modules/meals/mealRoutes";
import { OrderRoutes } from "./modules/order/orderRoutes";
import { UserRoutes } from "./modules/user/user.router";
import { ProviderRoutes } from "./modules/provider/providerRoutes";


const app=express();

app.use(cors({
    origin:process.env.APP_URL || "http://localhost:3000",
    credentials:true
}))
app.use(express.json());

app.use("/api/users", UserRoutes);

app.use("/api/providers", ProviderRoutes)

app.use("/api/categories", CategoryRoutes);

app.use("/api/meals", MealRoutes);

app.use("/api/orders", OrderRoutes);


app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/",(req,res)=>{
    res.send("Hello world")
})


export default app;