// src/app.ts
import express9 from "express";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [
    "driverAdapters"
  ],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider        = "prisma-client"\n  output          = "../generated/prisma"\n  previewFeatures = ["driverAdapters"]\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id              String           @id @default(uuid())\n  name            String\n  email           String           @unique\n  password        String?\n  role            UserRole         @default(CUSTOMER)\n  status          UserStatus       @default(ACTIVE)\n  createdAt       DateTime         @default(now())\n  updatedAt       DateTime         @updatedAt\n  emailVerified   Boolean          @default(true)\n  image           String?\n  phone           String?\n  accounts        Account[]\n  cart            Cart?\n  orders          Order[]          @relation("CustomerOrders")\n  providerProfile ProviderProfile?\n  reviews         Review[]\n  sessions        Session[]\n\n  @@map("users")\n}\n\nmodel ProviderProfile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  restaurantName String\n  description    String?\n  address        String\n  phone          String\n  isOpen         Boolean  @default(true)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n  meals          Meal[]\n  orders         Order[]  @relation("ProviderOrders")\n  user           User     @relation(fields: [userId], references: [id])\n\n  @@map("provider_profiles")\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  name      String   @unique\n  image     String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  meals     Meal[]\n\n  @@map("categories")\n}\n\nmodel Meal {\n  id          String          @id @default(uuid())\n  name        String\n  description String\n  price       Float\n  image       String?\n  isAvailable Boolean         @default(true)\n  createdAt   DateTime        @default(now())\n  updatedAt   DateTime        @updatedAt\n  providerId  String\n  categoryId  String\n  cartItems   CartItem[]\n  category    Category        @relation(fields: [categoryId], references: [id])\n  provider    ProviderProfile @relation(fields: [providerId], references: [id])\n  orderItems  OrderItem[]\n  reviews     Review[]\n\n  @@index([providerId])\n  @@index([categoryId])\n  @@map("meals")\n}\n\nmodel Cart {\n  id        String     @id @default(uuid())\n  userId    String     @unique\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  items     CartItem[]\n  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("carts")\n}\n\nmodel CartItem {\n  id       String @id @default(uuid())\n  cartId   String\n  mealId   String\n  quantity Int    @default(1)\n  price    Float\n  cart     Cart   @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  meal     Meal   @relation(fields: [mealId], references: [id])\n\n  @@index([cartId])\n  @@index([mealId])\n  @@map("cart_items")\n}\n\nmodel Order {\n  id              String          @id @default(uuid())\n  totalAmount     Float\n  deliveryAddress String\n  status          OrderStatus     @default(PLACED)\n  paymentMethod   String          @default("CASH_ON_DELIVERY")\n  createdAt       DateTime        @default(now())\n  updatedAt       DateTime        @updatedAt\n  customerId      String\n  providerId      String\n  items           OrderItem[]\n  customer        User            @relation("CustomerOrders", fields: [customerId], references: [id])\n  provider        ProviderProfile @relation("ProviderOrders", fields: [providerId], references: [id])\n\n  @@index([customerId])\n  @@index([providerId])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id       String @id @default(uuid())\n  quantity Int\n  price    Float\n  orderId  String\n  mealId   String\n  meal     Meal   @relation(fields: [mealId], references: [id])\n  order    Order  @relation(fields: [orderId], references: [id])\n\n  @@index([orderId])\n  @@index([mealId])\n  @@map("order_items")\n}\n\nmodel Review {\n  id         String   @id @default(uuid())\n  rating     Int\n  comment    String?\n  createdAt  DateTime @default(now())\n  customerId String\n  mealId     String\n  customer   User     @relation(fields: [customerId], references: [id])\n  meal       Meal     @relation(fields: [mealId], references: [id])\n\n  @@index([customerId])\n  @@index([mealId])\n  @@map("reviews")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum UserRole {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"}],"dbName":"users"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isOpen","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"ProviderOrders"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"}],"dbName":"provider_profiles"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"categories"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"image","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMeal"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"}],"dbName":"meals"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"}],"dbName":"carts"},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"meal","kind":"object","type":"Meal","relationName":"CartItemToMeal"}],"dbName":"cart_items"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentMethod","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderOrders"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"}],"dbName":"order_items"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"}],"dbName":"reviews"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var UserRole = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var pool = new pg.Pool({ connectionString });
var adapter = new PrismaPg(pool);
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
      // 5 minutes
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false
    },
    disableCSRFCheck: true
    // Allow requests without Origin header (Postman, mobile apps, etc.)
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              emailVerified: true
            }
          };
        }
      }
    }
  },
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Food Hub" <foodhub@gmail.com>',
          to: user.email,
          subject: "Please Verify Your Email \u2705",
          text: `Hi ${user.name},

Please verify your email by clicking the link: ${verificationUrl}

Thank you,
Food Hub Team`,
          html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333;">Hi ${user.name},</h2>
        <p style="font-size: 16px; color: #555;">
            Thank you for signing up on <strong>Food Hub</strong>! Please verify your email by clicking the button below:
        </p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #FF6B6B; color: white; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px;">
                Verify Email
            </a>
        </p>
        <p style="font-size: 14px; color: #999;">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${url}" style="color: #555;">${verificationUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa;">
            Food Hub Team<br/>
            &copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Food Hub. All rights reserved.
        </p>
    </div>
    `
        });
        console.log("Verification email sent:", info.messageId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/app.ts
import cors from "cors";

// src/modules/category/category.routes.ts
import express from "express";

// src/modules/category/category.service.ts
var createCategoryIntoDB = async (payload) => {
  return await prisma.category.create({
    data: payload
  });
};
var getAllCategoriesFromDB = async (query) => {
  const { searchTerm, page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const whereCondition = searchTerm ? {
    name: {
      contains: searchTerm,
      mode: "insensitive"
    }
  } : {};
  const result = await prisma.category.findMany({
    where: whereCondition,
    skip,
    take,
    orderBy: {
      name: "asc"
    }
  });
  const total = await prisma.category.count({ where: whereCondition });
  return {
    meta: {
      page: Number(page),
      limit: take,
      total,
      totalPage: Math.ceil(total / take)
    },
    data: result
  };
};
var updateCategoryInDB = async (id, payload) => {
  return await prisma.category.update({
    where: { id },
    data: payload
  });
};
var deleteCategoryFromDB = async (id) => {
  return await prisma.category.delete({
    where: { id }
  });
};
var CategoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB
};

// src/modules/category/category.controller.ts
var createCategory = async (req, res) => {
  try {
    const result = await CategoryService.createCategoryIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully!",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};
var getAllCategories = async (req, res) => {
  try {
    const result = await CategoryService.getAllCategoriesFromDB(req.query);
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      meta: result.meta,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories"
    });
  }
};
var updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.updateCategoryInDB(id, req.body);
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update category"
    });
  }
};
var deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryService.deleteCategoryFromDB(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category"
    });
  }
};
var CategoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
};

// src/middlewares/auth.ts
var auth2 = (...role) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (role.length && !role.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You don't have permission to access"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth2;

// src/modules/category/category.routes.ts
var router = express.Router();
router.post("/", auth_default("ADMIN" /* ADMIN */), CategoryController.createCategory);
router.patch("/:id", auth_default("ADMIN" /* ADMIN */), CategoryController.updateCategory);
router.delete("/:id", auth_default("ADMIN" /* ADMIN */), CategoryController.deleteCategory);
router.get("/", CategoryController.getAllCategories);
var CategoryRoutes = router;

// src/modules/meals/mealRoutes.ts
import express2 from "express";

// src/modules/meals/mealService.ts
var getProviderIdByUserId = async (userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!provider) {
    throw new Error("Provider profile not found for this user!");
  }
  return provider.id;
};
var createMealIntoDB = async (payload, userId) => {
  const { name, categoryId } = payload;
  const providerId = await getProviderIdByUserId(userId);
  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  if (!categoryExists) throw new Error("Invalid Category ID");
  const alreadyExists = await prisma.meal.findFirst({
    where: {
      name: { equals: name, mode: "insensitive" },
      providerId
    }
  });
  if (alreadyExists) {
    throw new Error("You have already added a meal with this name!");
  }
  return await prisma.meal.create({
    data: { ...payload, providerId },
    include: { category: true }
  });
};
var getAllMealsFromDB = async (query) => {
  const { searchTerm, categoryId, minPrice, maxPrice, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const whereCondition = {
    AND: [
      searchTerm ? {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } }
        ]
      } : {},
      categoryId ? { categoryId } : {},
      {
        price: {
          gte: minPrice ? Number(minPrice) : 0,
          lte: maxPrice ? Number(maxPrice) : 999999
        }
      }
    ]
  };
  const result = await prisma.meal.findMany({
    where: whereCondition,
    skip,
    take: Number(limit),
    include: {
      category: true,
      provider: {
        select: {
          id: true,
          restaurantName: true,
          user: { select: { name: true, email: true } }
        }
      },
      reviews: {
        select: { rating: true }
      }
    },
    orderBy: { [sortBy]: sortOrder }
  });
  const total = await prisma.meal.count({ where: whereCondition });
  return {
    meta: { page: Number(page), limit: Number(limit), total, totalPage: Math.ceil(total / Number(limit)) },
    data: result
  };
};
var updateMealInDB = async (mealId, userId, payload) => {
  const providerId = await getProviderIdByUserId(userId);
  const result = await prisma.meal.update({
    where: {
      id: mealId,
      providerId
    },
    data: payload
  });
  if (!result) {
    throw new Error("Meal not found or you are not authorized!");
  }
  return result;
};
var deleteMealFromDB = async (mealId, userId) => {
  const providerId = await getProviderIdByUserId(userId);
  return await prisma.meal.delete({
    where: { id: mealId, providerId }
  });
};
var getSingleMealFromDB = async (id) => {
  const result = await prisma.meal.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      provider: {
        select: {
          restaurantName: true,
          address: true,
          phone: true
        }
      },
      reviews: {
        include: {
          customer: {
            select: { name: true, image: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  return result;
};
var MealService = {
  createMealIntoDB,
  getAllMealsFromDB,
  updateMealInDB,
  deleteMealFromDB,
  getSingleMealFromDB
};

// src/modules/meals/mealController.ts
var createMeal = async (req, res) => {
  try {
    const providerId = req.user.id;
    const result = await MealService.createMealIntoDB(req.body, providerId);
    res.status(201).json({ success: true, message: "Meal added successfully", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Failed to create meal" });
  }
};
var getAllMeals = async (req, res) => {
  try {
    const result = await MealService.getAllMealsFromDB(req.query);
    res.status(200).json({ success: true, message: "Meals retrieved successfully", meta: result.meta, data: result.data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
var updateMeal = async (req, res) => {
  try {
    const user = req.user;
    const userId = user.id;
    const mealId = req.params.id;
    const payload = req.body;
    const result = await MealService.updateMealInDB(mealId, userId, payload);
    res.status(200).json({
      success: true,
      message: "Meal updated successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update meal"
    });
  }
};
var deleteMeal = async (req, res) => {
  try {
    await MealService.deleteMealFromDB(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: "Meal deleted successfully" });
  } catch (error) {
    res.status(403).json({ success: false, message: "Unauthorized or Meal not found" });
  }
};
var getMealDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MealService.getSingleMealFromDB(id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Meal not found!" });
    }
    res.status(200).json({
      success: true,
      message: "Meal details retrieved successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
var MealController = {
  createMeal,
  getAllMeals,
  updateMeal,
  deleteMeal,
  getMealDetails
};

// src/modules/meals/mealRoutes.ts
var router2 = express2.Router();
router2.get("/", MealController.getAllMeals);
router2.get("/:id", MealController.getMealDetails);
router2.post("/add-meal", auth_default("PROVIDER" /* PROVIDER */), MealController.createMeal);
router2.put("/:id", auth_default("PROVIDER" /* PROVIDER */), MealController.updateMeal);
router2.delete("/:id", auth_default("PROVIDER" /* PROVIDER */), MealController.deleteMeal);
var MealRoutes = router2;

// src/modules/order/orderRoutes.ts
import express3 from "express";

// src/modules/order/orderService.ts
var createOrderIntoDB = async (userId, payload) => {
  const { items, deliveryAddress } = payload;
  if (!items || items.length === 0) throw new Error("Order items cannot be empty");
  if (!deliveryAddress || deliveryAddress.trim() === "") {
    throw new Error("Delivery address is required");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { status: true }
  });
  if (user?.status === "SUSPENDED") {
    throw new Error("Your account is suspended! You cannot place any new orders.");
  }
  return await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData = [];
    let finalProviderProfileId = "";
    for (const item of items) {
      const meal = await tx.meal.findUnique({
        where: { id: item.mealId }
      });
      if (!meal) throw new Error(`Meal not found: ${item.mealId}`);
      if (!finalProviderProfileId) {
        finalProviderProfileId = meal.providerId;
      }
      totalAmount += meal.price * item.quantity;
      orderItemsData.push({
        mealId: meal.id,
        quantity: item.quantity,
        price: meal.price
      });
    }
    return await tx.order.create({
      data: {
        customerId: userId,
        providerId: finalProviderProfileId,
        deliveryAddress,
        totalAmount,
        status: "PLACED",
        items: { create: orderItemsData }
      },
      include: { items: true }
    });
  });
};
var getAllOrdersFromDB = async (query, role, userId) => {
  const { status, searchTerm, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);
  const whereConditions = {};
  if (role === UserRole.PROVIDER) {
    const providerProfile = await prisma.providerProfile.findUnique({ where: { userId } });
    if (!providerProfile) throw new Error("Provider profile not found");
    whereConditions.providerId = providerProfile.id;
  } else if (role === UserRole.CUSTOMER) {
    whereConditions.customerId = userId;
  }
  if (status) whereConditions.status = status;
  if (searchTerm) {
    whereConditions.OR = [
      { deliveryAddress: { contains: searchTerm, mode: "insensitive" } },
      { id: { contains: searchTerm, mode: "insensitive" } }
    ];
  }
  const orders = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take,
    orderBy: { [sortBy]: sortOrder },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      provider: { select: { restaurantName: true, phone: true } },
      items: { include: { meal: true } }
    }
  });
  const total = await prisma.order.count({ where: whereConditions });
  return {
    meta: { page: Number(page), limit: take, total, totalPage: Math.ceil(total / take) },
    data: orders
  };
};
var getOrderByIdFromDB = async (orderId, userId, role) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { meal: true } }, customer: true, provider: true }
  });
  if (!order) throw new Error("Order not found");
  if (role === UserRole.CUSTOMER && order.customerId !== userId) throw new Error("Unauthorized");
  return order;
};
var updateOrderStatusByProvider = async (orderId, userId, status) => {
  const provider = await prisma.providerProfile.findUnique({ where: { userId } });
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.providerId !== provider?.id) {
    throw new Error("You are not authorized to update this order");
  }
  return await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
};
var getMyOrdersFromDB = async (userId, query) => {
  return await getAllOrdersFromDB(query, UserRole.CUSTOMER, userId);
};
var OrderService = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getMyOrdersFromDB,
  getOrderByIdFromDB,
  updateOrderStatusByProvider
};

// src/modules/order/orderController.ts
var createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await OrderService.createOrderIntoDB(userId, req.body);
    res.status(201).json({ success: true, message: "Order placed successfully", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await OrderService.getMyOrdersFromDB(userId, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var getAllOrders = async (req, res) => {
  try {
    const user = req.user;
    const result = await OrderService.getAllOrdersFromDB(req.query, user.role, user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var getOrderDetails = async (req, res) => {
  try {
    const user = req.user;
    const result = await OrderService.getOrderByIdFromDB(req.params.id, user.id, user.role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var updateOrderStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.body;
    const result = await OrderService.updateOrderStatusByProvider(req.params.id, userId, status);
    res.status(200).json({ success: true, message: "Status updated", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var OrderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus
};

// src/modules/order/orderRoutes.ts
var router3 = express3.Router();
router3.post("/", auth_default("CUSTOMER" /* CUSTOMER */), OrderController.createOrder);
router3.get("/my-orders", auth_default("CUSTOMER" /* CUSTOMER */), OrderController.getMyOrders);
router3.get("/", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */), OrderController.getAllOrders);
router3.get("/:id", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */, "CUSTOMER" /* CUSTOMER */), OrderController.getOrderDetails);
router3.patch("/:id", auth_default("PROVIDER" /* PROVIDER */), OrderController.updateOrderStatus);
var OrderRoutes = router3;

// src/modules/user/user.router.ts
import express4 from "express";

// src/modules/user/user.service.ts
var createUserService = async (payload) => {
  const { name, email, password, role, phone } = payload;
  return await prisma.user.create({
    data: {
      name,
      email,
      password,
      role: role || "CUSTOMER",
      phone: phone || null
    }
  });
};
var loginUserService = async (payload) => {
  const { email, password } = payload;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found!");
  if (user.status === UserStatus.SUSPENDED) throw new Error("Account Suspended!");
  return user;
};
var getAllUsersService = async () => {
  return await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
  });
};
var getMyProfile = async (identifier) => {
  return await prisma.user.findFirst({
    where: {
      OR: [
        { id: identifier },
        { email: identifier }
      ]
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true
    }
  });
};
var updateUserStatusInDB = async (id, status) => {
  return await prisma.user.update({
    where: { id },
    data: { status }
  });
};
var UserService = {
  createUserService,
  loginUserService,
  getAllUsersService,
  getMyProfile,
  updateUserStatusInDB
};

// src/modules/user/user.controller.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var registerUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await UserService.createUserService({ ...rest, password: hashedPassword });
    res.status(201).json({ success: true, message: "User registered!", data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var loginUser = async (req, res) => {
  try {
    const user = await UserService.loginUserService(req.body);
    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (!isMatched) throw new Error("Invalid password!");
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var getMyProfile2 = async (req, res) => {
  try {
    const userPayload = req.user;
    const identifier = userPayload.id || userPayload.email;
    const result = await UserService.getMyProfile(identifier);
    if (!result) {
      return res.status(404).json({ success: false, message: "User not found!" });
    }
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: result
    });
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized!" });
  }
};
var updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await UserService.updateUserStatusInDB(id, status);
    res.status(200).json({ success: true, message: "User status updated!", data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var getAllUsers = async (req, res) => {
  try {
    const result = await UserService.getAllUsersService();
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
var UserController = {
  registerUser,
  loginUser,
  getMyProfile: getMyProfile2,
  getAllUsers,
  updateUserStatus
};

// src/modules/user/user.router.ts
var router4 = express4.Router();
router4.post("/register", UserController.registerUser);
router4.post("/login", UserController.loginUser);
router4.get("/", auth_default("ADMIN" /* ADMIN */), UserController.getAllUsers);
router4.get("/me", auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), UserController.getMyProfile);
router4.patch("/admin/users/:id", auth_default("ADMIN" /* ADMIN */), UserController.updateUserStatus);
var UserRoutes = router4;

// src/modules/provider/providerRoutes.ts
import express5 from "express";

// src/modules/provider/providerService.ts
var getAllProvidersFromDB = async () => {
  return await prisma.providerProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    }
  });
};
var getProviderWithMenuFromDB = async (id) => {
  return await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true, phone: true }
      },
      meals: {
        where: { isAvailable: true },
        include: { category: true }
      }
    }
  });
};
var ProviderService = {
  getAllProvidersFromDB,
  getProviderWithMenuFromDB
};

// src/modules/provider/providerController.ts
var getAllProviders = async (req, res) => {
  const result = await ProviderService.getAllProvidersFromDB();
  res.status(200).json({
    success: true,
    message: "Providers retrieved successfully",
    data: result
  });
};
var getProviderDetails = async (req, res) => {
  const { id } = req.params;
  const result = await ProviderService.getProviderWithMenuFromDB(id);
  if (!result) {
    return res.status(404).json({ success: false, message: "Provider not found!" });
  }
  res.status(200).json({
    success: true,
    message: "Provider with menu retrieved successfully",
    data: result
  });
};
var ProviderController = {
  getAllProviders,
  getProviderDetails
};

// src/modules/provider/providerRoutes.ts
var router5 = express5.Router();
router5.get("/", ProviderController.getAllProviders);
router5.get("/:id", ProviderController.getProviderDetails);
var ProviderRoutes = router5;

// src/modules/review/reviewRoutes.ts
import express6 from "express";

// src/modules/review/reviewServices.ts
var createReviewIntoDB = async (userId, payload) => {
  return await prisma.review.create({
    data: {
      rating: Number(payload.rating),
      comment: payload.comment,
      customerId: userId,
      mealId: payload.mealId
    }
  });
};
var getMealReviewsFromDB = async (mealId) => {
  return await prisma.review.findMany({
    where: { mealId },
    include: {
      customer: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var ReviewService = { createReviewIntoDB, getMealReviewsFromDB };

// src/modules/review/reviewController.ts
var createReview = async (req, res) => {
  const user = req.user;
  const result = await ReviewService.createReviewIntoDB(user.id, req.body);
  res.status(201).json({ success: true, message: "Review added!", data: result });
};
var getMealReviews = async (req, res) => {
  const { mealId } = req.params;
  const result = await ReviewService.getMealReviewsFromDB(mealId);
  res.status(200).json({ success: true, data: result });
};
var ReviewController = { createReview, getMealReviews };

// src/modules/review/reviewRoutes.ts
var router6 = express6.Router();
router6.post("/", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.createReview);
router6.get("/:mealId", ReviewController.getMealReviews);
var ReviewRoutes = router6;

// src/modules/stats/state.routes.ts
import express7 from "express";

// src/modules/stats/stats.service.ts
var getAdminStatsFromDB = async () => {
  const totalUsers = await prisma.user.count();
  const totalProviders = await prisma.providerProfile.count();
  const totalMeals = await prisma.meal.count();
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    where: { status: "DELIVERED" },
    _sum: { totalAmount: true }
  });
  return {
    totalUsers,
    totalProviders,
    totalMeals,
    totalOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0
  };
};
var getProviderStatsFromDB = async (userId) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { userId }
  });
  if (!provider) throw new Error("Provider not found!");
  const myTotalMeals = await prisma.meal.count({
    where: { providerId: provider.id }
  });
  const myOrders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          meal: { providerId: provider.id }
        }
      }
    }
  });
  const myRevenue = myOrders.filter((order) => order.status === "DELIVERED").reduce((sum, order) => sum + order.totalAmount, 0);
  return {
    myTotalMeals,
    totalOrders: myOrders.length,
    totalRevenue: myRevenue,
    recentOrders: myOrders.slice(0, 5)
  };
};
var StatsService = {
  getAdminStatsFromDB,
  getProviderStatsFromDB
};

// src/modules/stats/stats.controller.ts
var getStats = async (req, res) => {
  const user = req.user;
  let result;
  if (user.role === "ADMIN") {
    result = await StatsService.getAdminStatsFromDB();
  } else if (user.role === "PROVIDER") {
    result = await StatsService.getProviderStatsFromDB(user.id);
  }
  res.status(200).json({
    success: true,
    message: "Statistics retrieved successfully",
    data: result
  });
};
var StatsController = { getStats };

// src/modules/stats/state.routes.ts
var router7 = express7.Router();
router7.get(
  "/",
  auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */),
  StatsController.getStats
);
var StatsRoutes = router7;

// src/modules/admin/adminRoutes.ts
import express8 from "express";

// src/modules/admin/adminService.ts
var getAllUsersFromDB = async (role) => {
  return await prisma.user.findMany({
    where: role ? { role } : {},
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateUserRoleInDB = async (userId, newRole) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });
};
var getAdminDashboardStats = async () => {
  const [totalUsers, totalProviders, totalMeals, totalOrders, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.providerProfile.count(),
    prisma.meal.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: "DELIVERED" },
      _sum: { totalAmount: true }
    })
  ]);
  return {
    totalUsers,
    totalProviders,
    totalMeals,
    totalOrders,
    totalRevenue: revenue._sum.totalAmount || 0
  };
};
var deleteAnyMealFromDB = async (mealId) => {
  return await prisma.meal.delete({
    where: { id: mealId }
  });
};
var AdminService = {
  getAllUsersFromDB,
  updateUserRoleInDB,
  getAdminDashboardStats,
  deleteAnyMealFromDB
};

// src/modules/admin/adminController.ts
var getAllUsers2 = async (req, res) => {
  const role = req.query.role;
  const result = await AdminService.getAllUsersFromDB(role);
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: result
  });
};
var getStats2 = async (req, res) => {
  const result = await AdminService.getAdminDashboardStats();
  res.status(200).json({
    success: true,
    message: "Admin stats retrieved successfully",
    data: result
  });
};
var deleteMeal2 = async (req, res) => {
  await AdminService.deleteAnyMealFromDB(req.params.id);
  res.status(200).json({
    success: true,
    message: "Meal deleted successfully by Admin"
  });
};
var AdminController = {
  getAllUsers: getAllUsers2,
  getStats: getStats2,
  deleteMeal: deleteMeal2
};

// src/modules/admin/adminRoutes.ts
var router8 = express8.Router();
router8.get("/users", auth_default("ADMIN" /* ADMIN */), AdminController.getAllUsers);
router8.get("/stats", auth_default("ADMIN" /* ADMIN */), AdminController.getStats);
router8.delete("/meals/:id", auth_default("ADMIN" /* ADMIN */), AdminController.deleteMeal);
var AdminRoutes = router8;

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  if (err.code === "P2002") {
    statusCode = 400;
    message = "Duplicate value found in database.";
  }
  if (err.code === "P2003") {
    statusCode = 400;
    message = "Invalid reference: The provided ID does not exist in the related table.";
  }
  res.status(statusCode).json({
    success: false,
    message,
    error: err
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/modules/cart/cartRoutes.ts
import { Router } from "express";

// src/modules/cart/cartServices.ts
var addToCartIntoDB = async (userId, mealId, quantity, price) => {
  if (!userId) {
    throw new Error("User ID is required to perform this action.");
  }
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, mealId }
  });
  if (existingItem) {
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  }
  return await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      mealId,
      quantity,
      price
    }
  });
};
var getCartFromDB = async (userId) => {
  if (!userId) return null;
  return await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          meal: {
            include: {
              category: true
            }
          }
        }
      }
    }
  });
};
var removeFromCartFromDB = async (itemId) => {
  return await prisma.cartItem.delete({
    where: { id: itemId }
  });
};
var CartService = {
  addToCartIntoDB,
  getCartFromDB,
  removeFromCartFromDB
};

// src/modules/cart/cartController.ts
var addItemToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { mealId, quantity, price } = req.body;
    const result = await CartService.addToCartIntoDB(userId, mealId, quantity, price);
    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getUserCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized! Please login." });
    }
    const result = await CartService.getCartFromDB(userId);
    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    await CartService.removeFromCartFromDB(itemId);
    res.status(200).json({ success: true, message: "Item removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var CartController = {
  addItemToCart,
  getUserCart,
  removeCartItem
};

// src/modules/cart/cartRoutes.ts
var router9 = Router();
router9.post("/add", auth_default("CUSTOMER" /* CUSTOMER */), CartController.addItemToCart);
router9.get("/:userId", auth_default("CUSTOMER" /* CUSTOMER */), CartController.getUserCart);
router9.delete("/:itemId", auth_default("CUSTOMER" /* CUSTOMER */), CartController.removeCartItem);
var CartRoutes = router9;

// src/app.ts
var app = express9();
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_FRONTEND_URL
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.use(express9.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/users", UserRoutes);
app.use("/api/providers", ProviderRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/meals", MealRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/stats", StatsRoutes);
app.use(globalErrorHandler_default);
app.get("/", (req, res) => {
  res.send("Food Delivery API is running...");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
