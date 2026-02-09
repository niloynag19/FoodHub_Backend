import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors'

import { CategoryRoutes } from "./modules/category/category.routes";
import { MealRoutes } from "./modules/meals/mealRoutes";
import { OrderRoutes } from "./modules/order/orderRoutes";
import { UserRoutes } from "./modules/user/user.router";
import { ProviderRoutes } from "./modules/provider/providerRoutes";
import { ReviewRoutes } from "./modules/review/reviewRoutes";
import { StatsRoutes } from "./modules/stats/state.routes";
import { AdminRoutes } from "./modules/admin/adminRoutes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { CartRoutes } from "./modules/cart/cartRoutes";


const app = express();

const allowedOrigins = [
    process.env.APP_URL || "http://localhost:3000",
    process.env.PROD_FRONTEND_URL,
].filter(Boolean);

// app.use(
//     cors({
//         origin: (origin, callback) => {
//             // Allow requests with no origin (mobile apps, Postman, etc.)
//             if (!origin) return callback(null, true);

//             // Check if origin is in allowedOrigins or matches Vercel preview pattern
//             const isAllowed =
//                 allowedOrigins.includes(origin) ||
//                 /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
//                 /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

//             if (isAllowed) {
//                 callback(null, true);
//             } else {
//                 callback(new Error(`Origin ${origin} not allowed by CORS`));
//             }
//         },
//         credentials: true,
//         methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//         allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
//         exposedHeaders: ["Set-Cookie"],
//     }),

// );
app.use(
    cors({
        origin: process.env.APP_URL, // Use your actual frontend URL
        credentials: true,
    }),
);
app.use(express.json());

// --- Routes Registration ---

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/users", UserRoutes);

app.use("/api/providers", ProviderRoutes);

app.use("/api/admin", AdminRoutes);

app.use("/api/categories", CategoryRoutes);

app.use("/api/meals", MealRoutes);

app.use("/api/orders", OrderRoutes);

app.use("/api/cart", CartRoutes);

app.use("/api/reviews", ReviewRoutes);

app.use("/api/stats", StatsRoutes)

app.use(globalErrorHandler);

// Better Auth Handler


app.get("/", (req, res) => {
    res.send("Food Delivery API is running...")
})

export default app;