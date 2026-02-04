var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}
var config;
var init_class = __esm({
  "generated/prisma/internal/class.ts"() {
    "use strict";
    config = {
      "previewFeatures": [
        "driverAdapters"
      ],
      "clientVersion": "7.3.0",
      "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
      "activeProvider": "postgresql",
      "inlineSchema": 'generator client {\n  provider        = "prisma-client"\n  output          = "../generated/prisma"\n  previewFeatures = ["driverAdapters"]\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// ==========================\n// ENUMS\n// =========================\n\nenum UserRole {\n  CUSTOMER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  SUSPENDED\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nmodel User {\n  id        String     @id @default(uuid())\n  name      String\n  email     String     @unique\n  password  String?\n  role      UserRole   @default(CUSTOMER)\n  status    UserStatus @default(ACTIVE)\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n\n  // Relations\n  providerProfile ProviderProfile?\n  orders          Order[]          @relation("CustomerOrders")\n  reviews         Review[]\n\n  emailVerified Boolean   @default(true)\n  image         String?\n  sessions      Session[]\n  accounts      Account[]\n\n  phone String?\n\n  @@map("users")\n}\n\nmodel ProviderProfile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  restaurantName String\n  description    String?\n  address        String\n  phone          String\n  isOpen         Boolean  @default(true)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n\n  // Relations\n  user   User    @relation(fields: [userId], references: [id])\n  meals  Meal[]\n  orders Order[] @relation("ProviderOrders")\n\n  @@map("provider_profiles")\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  name      String   @unique\n  image     String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n  meals Meal[]\n\n  @@map("categories")\n}\n\nmodel Meal {\n  id          String   @id @default(uuid())\n  name        String\n  description String\n  price       Float\n  image       String?\n  isAvailable Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  // Relations\n  providerId String\n  provider   ProviderProfile @relation(fields: [providerId], references: [id])\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  @@index([providerId])\n  @@index([categoryId])\n  @@map("meals")\n}\n\nmodel Order {\n  id              String      @id @default(uuid())\n  totalAmount     Float\n  deliveryAddress String\n  status          OrderStatus @default(PLACED)\n  paymentMethod   String      @default("CASH_ON_DELIVERY")\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n\n  customerId String\n  customer   User   @relation("CustomerOrders", fields: [customerId], references: [id])\n\n  providerId String\n  provider   ProviderProfile @relation("ProviderOrders", fields: [providerId], references: [id])\n\n  items OrderItem[]\n\n  @@index([customerId])\n  @@index([providerId])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id       String @id @default(uuid())\n  quantity Int\n  price    Float\n\n  orderId String\n  order   Order  @relation(fields: [orderId], references: [id])\n\n  mealId String\n  meal   Meal   @relation(fields: [mealId], references: [id])\n\n  @@index([orderId])\n  @@index([mealId])\n  @@map("order_items")\n}\n\nmodel Review {\n  id        String   @id @default(uuid())\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n\n  customerId String\n  customer   User   @relation(fields: [customerId], references: [id])\n\n  mealId String\n  meal   Meal   @relation(fields: [mealId], references: [id])\n\n  @@index([customerId])\n  @@index([mealId])\n  @@map("reviews")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
      "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
      }
    };
    config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"providerProfile","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"CustomerOrders"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"phone","kind":"scalar","type":"String"}],"dbName":"users"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"isOpen","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"ProviderOrders"}],"dbName":"provider_profiles"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"categories"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"image","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"}],"dbName":"meals"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Float"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentMethod","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"CustomerOrders"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderOrders"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"}],"dbName":"order_items"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"}],"dbName":"reviews"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
    config.compilerWasm = {
      getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
      getQueryCompilerWasmModule: async () => {
        const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
        return await decodeBase64AsWasm(wasm);
      },
      importName: "./query_compiler_fast_bg.js"
    };
  }
});

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext, NullTypes2, TransactionIsolationLevel, defineExtension;
var init_prismaNamespace = __esm({
  "generated/prisma/internal/prismaNamespace.ts"() {
    "use strict";
    getExtensionContext = runtime2.Extensions.getExtensionContext;
    NullTypes2 = {
      DbNull: runtime2.NullTypes.DbNull,
      JsonNull: runtime2.NullTypes.JsonNull,
      AnyNull: runtime2.NullTypes.AnyNull
    };
    TransactionIsolationLevel = runtime2.makeStrictEnum({
      ReadUncommitted: "ReadUncommitted",
      ReadCommitted: "ReadCommitted",
      RepeatableRead: "RepeatableRead",
      Serializable: "Serializable"
    });
    defineExtension = runtime2.Extensions.defineExtension;
  }
});

// generated/prisma/enums.ts
var UserRole, UserStatus;
var init_enums = __esm({
  "generated/prisma/enums.ts"() {
    "use strict";
    UserRole = {
      CUSTOMER: "CUSTOMER",
      PROVIDER: "PROVIDER",
      ADMIN: "ADMIN"
    };
    UserStatus = {
      ACTIVE: "ACTIVE",
      SUSPENDED: "SUSPENDED"
    };
  }
});

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";
var PrismaClient;
var init_client = __esm({
  "generated/prisma/client.ts"() {
    "use strict";
    init_class();
    init_prismaNamespace();
    init_enums();
    init_enums();
    globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
    PrismaClient = getPrismaClientClass();
  }
});

// src/lib/prisma.ts
import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString, pool, adapter, prisma;
var init_prisma = __esm({
  "src/lib/prisma.ts"() {
    "use strict";
    init_client();
    init_client();
    connectionString = `${process.env.DATABASE_URL}`;
    pool = new pg.Pool({ connectionString });
    adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }
});

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
var transporter, auth;
var init_auth = __esm({
  "src/lib/auth.ts"() {
    "use strict";
    init_prisma();
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    auth = betterAuth({
      database: prismaAdapter(prisma, {
        provider: "postgresql"
      }),
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
        sendOnSignUp: true,
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
  }
});

// src/modules/category/category.service.ts
var createCategoryIntoDB, getAllCategoriesFromDB, updateCategoryInDB, deleteCategoryFromDB, CategoryService;
var init_category_service = __esm({
  "src/modules/category/category.service.ts"() {
    "use strict";
    init_prisma();
    createCategoryIntoDB = async (payload) => {
      return await prisma.category.create({
        data: payload
      });
    };
    getAllCategoriesFromDB = async (query) => {
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
    updateCategoryInDB = async (id, payload) => {
      return await prisma.category.update({
        where: { id },
        data: payload
      });
    };
    deleteCategoryFromDB = async (id) => {
      return await prisma.category.delete({
        where: { id }
      });
    };
    CategoryService = {
      createCategoryIntoDB,
      getAllCategoriesFromDB,
      updateCategoryInDB,
      deleteCategoryFromDB
    };
  }
});

// src/modules/category/category.controller.ts
var createCategory, getAllCategories, updateCategory, deleteCategory, CategoryController;
var init_category_controller = __esm({
  "src/modules/category/category.controller.ts"() {
    "use strict";
    init_category_service();
    createCategory = async (req, res) => {
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
    getAllCategories = async (req, res) => {
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
    updateCategory = async (req, res) => {
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
    deleteCategory = async (req, res) => {
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
    CategoryController = {
      createCategory,
      getAllCategories,
      updateCategory,
      deleteCategory
    };
  }
});

// src/middlewares/auth.ts
var auth2, auth_default;
var init_auth2 = __esm({
  "src/middlewares/auth.ts"() {
    "use strict";
    init_auth();
    auth2 = (...role) => {
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
          if (!session.user.emailVerified) {
            return res.status(403).json({
              success: false,
              message: "Email verification required . Please verify your email"
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
    auth_default = auth2;
  }
});

// src/modules/category/category.routes.ts
import express from "express";
var router, CategoryRoutes;
var init_category_routes = __esm({
  "src/modules/category/category.routes.ts"() {
    "use strict";
    init_category_controller();
    init_auth2();
    router = express.Router();
    router.post("/", auth_default("ADMIN" /* ADMIN */), CategoryController.createCategory);
    router.patch("/:id", auth_default("ADMIN" /* ADMIN */), CategoryController.updateCategory);
    router.delete("/:id", auth_default("ADMIN" /* ADMIN */), CategoryController.deleteCategory);
    router.get("/", CategoryController.getAllCategories);
    CategoryRoutes = router;
  }
});

// src/modules/meals/mealService.ts
var getProviderIdByUserId, createMealIntoDB, getAllMealsFromDB, updateMealInDB, deleteMealFromDB, getSingleMealFromDB, MealService;
var init_mealService = __esm({
  "src/modules/meals/mealService.ts"() {
    "use strict";
    init_prisma();
    getProviderIdByUserId = async (userId) => {
      const provider = await prisma.providerProfile.findUnique({
        where: { userId }
      });
      if (!provider) {
        throw new Error("Provider profile not found for this user!");
      }
      return provider.id;
    };
    createMealIntoDB = async (payload, userId) => {
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
    getAllMealsFromDB = async (query) => {
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
    updateMealInDB = async (mealId, userId, payload) => {
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
    deleteMealFromDB = async (mealId, userId) => {
      const providerId = await getProviderIdByUserId(userId);
      return await prisma.meal.delete({
        where: { id: mealId, providerId }
      });
    };
    getSingleMealFromDB = async (id) => {
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
    MealService = {
      createMealIntoDB,
      getAllMealsFromDB,
      updateMealInDB,
      deleteMealFromDB,
      getSingleMealFromDB
    };
  }
});

// src/modules/meals/mealController.ts
var createMeal, getAllMeals, updateMeal, deleteMeal, getMealDetails, MealController;
var init_mealController = __esm({
  "src/modules/meals/mealController.ts"() {
    "use strict";
    init_mealService();
    createMeal = async (req, res) => {
      try {
        const providerId = req.user.id;
        const result = await MealService.createMealIntoDB(req.body, providerId);
        res.status(201).json({ success: true, message: "Meal added successfully", data: result });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message || "Failed to create meal" });
      }
    };
    getAllMeals = async (req, res) => {
      try {
        const result = await MealService.getAllMealsFromDB(req.query);
        res.status(200).json({ success: true, message: "Meals retrieved successfully", meta: result.meta, data: result.data });
      } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    };
    updateMeal = async (req, res) => {
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
    deleteMeal = async (req, res) => {
      try {
        await MealService.deleteMealFromDB(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: "Meal deleted successfully" });
      } catch (error) {
        res.status(403).json({ success: false, message: "Unauthorized or Meal not found" });
      }
    };
    getMealDetails = async (req, res) => {
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
    MealController = {
      createMeal,
      getAllMeals,
      updateMeal,
      deleteMeal,
      getMealDetails
    };
  }
});

// src/modules/meals/mealRoutes.ts
import express2 from "express";
var router2, MealRoutes;
var init_mealRoutes = __esm({
  "src/modules/meals/mealRoutes.ts"() {
    "use strict";
    init_auth2();
    init_mealController();
    router2 = express2.Router();
    router2.get("/", MealController.getAllMeals);
    router2.get("/:id", MealController.getMealDetails);
    router2.post("/add-meal", auth_default("PROVIDER" /* PROVIDER */), MealController.createMeal);
    router2.put("/:id", auth_default("PROVIDER" /* PROVIDER */), MealController.updateMeal);
    router2.delete("/:id", auth_default("PROVIDER" /* PROVIDER */), MealController.deleteMeal);
    MealRoutes = router2;
  }
});

// src/modules/order/orderService.ts
var createOrderIntoDB, getAllOrdersFromDB, getOrderByIdFromDB, updateOrderStatusByProvider, getMyOrdersFromDB, OrderService;
var init_orderService = __esm({
  "src/modules/order/orderService.ts"() {
    "use strict";
    init_prisma();
    createOrderIntoDB = async (userId, payload) => {
      const { items, deliveryAddress } = payload;
      if (!items || items.length === 0) throw new Error("Order items cannot be empty");
      if (!deliveryAddress || deliveryAddress.trim() === "") {
        throw new Error("Delivery address is required");
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
    getAllOrdersFromDB = async (query, role, userId) => {
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
    getOrderByIdFromDB = async (orderId, userId, role) => {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { meal: true } }, customer: true, provider: true }
      });
      if (!order) throw new Error("Order not found");
      if (role === UserRole.CUSTOMER && order.customerId !== userId) throw new Error("Unauthorized");
      return order;
    };
    updateOrderStatusByProvider = async (orderId, userId, status) => {
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
    getMyOrdersFromDB = async (userId, query) => {
      return await getAllOrdersFromDB(query, UserRole.CUSTOMER, userId);
    };
    OrderService = {
      createOrderIntoDB,
      getAllOrdersFromDB,
      getMyOrdersFromDB,
      getOrderByIdFromDB,
      updateOrderStatusByProvider
    };
  }
});

// src/modules/order/orderController.ts
var createOrder, getMyOrders, getAllOrders, getOrderDetails, updateOrderStatus, OrderController;
var init_orderController = __esm({
  "src/modules/order/orderController.ts"() {
    "use strict";
    init_orderService();
    createOrder = async (req, res) => {
      try {
        const userId = req.user.id;
        const result = await OrderService.createOrderIntoDB(userId, req.body);
        res.status(201).json({ success: true, message: "Order placed successfully", data: result });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    };
    getMyOrders = async (req, res) => {
      try {
        const userId = req.user.id;
        const result = await OrderService.getMyOrdersFromDB(userId, req.query);
        res.status(200).json({ success: true, data: result });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    };
    getAllOrders = async (req, res) => {
      try {
        const user = req.user;
        const result = await OrderService.getAllOrdersFromDB(req.query, user.role, user.id);
        res.status(200).json({ success: true, data: result });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    };
    getOrderDetails = async (req, res) => {
      try {
        const user = req.user;
        const result = await OrderService.getOrderByIdFromDB(req.params.id, user.id, user.role);
        res.status(200).json({ success: true, data: result });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    };
    updateOrderStatus = async (req, res) => {
      try {
        const userId = req.user.id;
        const { status } = req.body;
        const result = await OrderService.updateOrderStatusByProvider(req.params.id, userId, status);
        res.status(200).json({ success: true, message: "Status updated", data: result });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    };
    OrderController = {
      createOrder,
      getMyOrders,
      getAllOrders,
      getOrderDetails,
      updateOrderStatus
    };
  }
});

// src/modules/order/orderRoutes.ts
import express3 from "express";
var router3, OrderRoutes;
var init_orderRoutes = __esm({
  "src/modules/order/orderRoutes.ts"() {
    "use strict";
    init_orderController();
    init_auth2();
    router3 = express3.Router();
    router3.post("/", auth_default("CUSTOMER" /* CUSTOMER */), OrderController.createOrder);
    router3.get("/my-orders", auth_default("CUSTOMER" /* CUSTOMER */), OrderController.getMyOrders);
    router3.get("/", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */), OrderController.getAllOrders);
    router3.get("/:id", auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */, "CUSTOMER" /* CUSTOMER */), OrderController.getOrderDetails);
    router3.patch("/:id", auth_default("PROVIDER" /* PROVIDER */), OrderController.updateOrderStatus);
    OrderRoutes = router3;
  }
});

// src/modules/user/user.service.ts
var createUserService, loginUserService, getAllUsersService, getMyProfile, updateUserStatusInDB, UserService;
var init_user_service = __esm({
  "src/modules/user/user.service.ts"() {
    "use strict";
    init_prisma();
    createUserService = async (payload) => {
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
    loginUserService = async (payload) => {
      const { email, password } = payload;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found!");
      if (user.status === UserStatus.SUSPENDED) throw new Error("Account Suspended!");
      return user;
    };
    getAllUsersService = async () => {
      return await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
      });
    };
    getMyProfile = async (identifier) => {
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
    updateUserStatusInDB = async (id, status) => {
      return await prisma.user.update({
        where: { id },
        data: { status }
      });
    };
    UserService = {
      createUserService,
      loginUserService,
      getAllUsersService,
      getMyProfile,
      updateUserStatusInDB
    };
  }
});

// src/modules/user/user.controller.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var registerUser, loginUser, getMyProfile2, updateUserStatus, getAllUsers, UserController;
var init_user_controller = __esm({
  "src/modules/user/user.controller.ts"() {
    "use strict";
    init_user_service();
    registerUser = async (req, res) => {
      try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await UserService.createUserService({ ...rest, password: hashedPassword });
        res.status(201).json({ success: true, message: "User registered!", data: result });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    };
    loginUser = async (req, res) => {
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
    getMyProfile2 = async (req, res) => {
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
    updateUserStatus = async (req, res) => {
      try {
        const { id } = req.params;
        const { status } = req.body;
        const result = await UserService.updateUserStatusInDB(id, status);
        res.status(200).json({ success: true, message: "User status updated!", data: result });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    };
    getAllUsers = async (req, res) => {
      try {
        const result = await UserService.getAllUsersService;
        res.status(200).json({ success: true, data: result });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    };
    UserController = {
      registerUser,
      loginUser,
      getMyProfile: getMyProfile2,
      getAllUsers,
      updateUserStatus
    };
  }
});

// src/modules/user/user.router.ts
import express4 from "express";
var router4, UserRoutes;
var init_user_router = __esm({
  "src/modules/user/user.router.ts"() {
    "use strict";
    init_user_controller();
    init_auth2();
    router4 = express4.Router();
    router4.post("/register", UserController.registerUser);
    router4.post("/login", UserController.loginUser);
    router4.get("/", auth_default("ADMIN" /* ADMIN */), UserController.getAllUsers);
    router4.get("/me", auth_default("ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */, "PROVIDER" /* PROVIDER */), UserController.getMyProfile);
    router4.patch("/admin/users/:id", auth_default("ADMIN" /* ADMIN */), UserController.updateUserStatus);
    UserRoutes = router4;
  }
});

// src/modules/provider/providerService.ts
var getAllProvidersFromDB, getProviderWithMenuFromDB, ProviderService;
var init_providerService = __esm({
  "src/modules/provider/providerService.ts"() {
    "use strict";
    init_prisma();
    getAllProvidersFromDB = async () => {
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
    getProviderWithMenuFromDB = async (id) => {
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
    ProviderService = {
      getAllProvidersFromDB,
      getProviderWithMenuFromDB
    };
  }
});

// src/modules/provider/providerController.ts
var getAllProviders, getProviderDetails, ProviderController;
var init_providerController = __esm({
  "src/modules/provider/providerController.ts"() {
    "use strict";
    init_providerService();
    getAllProviders = async (req, res) => {
      const result = await ProviderService.getAllProvidersFromDB();
      res.status(200).json({
        success: true,
        message: "Providers retrieved successfully",
        data: result
      });
    };
    getProviderDetails = async (req, res) => {
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
    ProviderController = {
      getAllProviders,
      getProviderDetails
    };
  }
});

// src/modules/provider/providerRoutes.ts
import express5 from "express";
var router5, ProviderRoutes;
var init_providerRoutes = __esm({
  "src/modules/provider/providerRoutes.ts"() {
    "use strict";
    init_providerController();
    router5 = express5.Router();
    router5.get("/", ProviderController.getAllProviders);
    router5.get("/:id", ProviderController.getProviderDetails);
    ProviderRoutes = router5;
  }
});

// src/modules/review/reviewServices.ts
var createReviewIntoDB, getMealReviewsFromDB, ReviewService;
var init_reviewServices = __esm({
  "src/modules/review/reviewServices.ts"() {
    "use strict";
    init_prisma();
    createReviewIntoDB = async (userId, payload) => {
      return await prisma.review.create({
        data: {
          rating: Number(payload.rating),
          comment: payload.comment,
          customerId: userId,
          mealId: payload.mealId
        }
      });
    };
    getMealReviewsFromDB = async (mealId) => {
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
    ReviewService = { createReviewIntoDB, getMealReviewsFromDB };
  }
});

// src/modules/review/reviewController.ts
var createReview, getMealReviews, ReviewController;
var init_reviewController = __esm({
  "src/modules/review/reviewController.ts"() {
    "use strict";
    init_reviewServices();
    createReview = async (req, res) => {
      const user = req.user;
      const result = await ReviewService.createReviewIntoDB(user.id, req.body);
      res.status(201).json({ success: true, message: "Review added!", data: result });
    };
    getMealReviews = async (req, res) => {
      const { mealId } = req.params;
      const result = await ReviewService.getMealReviewsFromDB(mealId);
      res.status(200).json({ success: true, data: result });
    };
    ReviewController = { createReview, getMealReviews };
  }
});

// src/modules/review/reviewRoutes.ts
import express6 from "express";
var router6, ReviewRoutes;
var init_reviewRoutes = __esm({
  "src/modules/review/reviewRoutes.ts"() {
    "use strict";
    init_auth2();
    init_reviewController();
    router6 = express6.Router();
    router6.post("/", auth_default("CUSTOMER" /* CUSTOMER */), ReviewController.createReview);
    router6.get("/:mealId", ReviewController.getMealReviews);
    ReviewRoutes = router6;
  }
});

// src/modules/stats/stats.service.ts
var getAdminStatsFromDB, getProviderStatsFromDB, StatsService;
var init_stats_service = __esm({
  "src/modules/stats/stats.service.ts"() {
    "use strict";
    init_prisma();
    getAdminStatsFromDB = async () => {
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
    getProviderStatsFromDB = async (userId) => {
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
    StatsService = {
      getAdminStatsFromDB,
      getProviderStatsFromDB
    };
  }
});

// src/modules/stats/stats.controller.ts
var getStats, StatsController;
var init_stats_controller = __esm({
  "src/modules/stats/stats.controller.ts"() {
    "use strict";
    init_stats_service();
    getStats = async (req, res) => {
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
    StatsController = { getStats };
  }
});

// src/modules/stats/state.routes.ts
import express7 from "express";
var router7, StatsRoutes;
var init_state_routes = __esm({
  "src/modules/stats/state.routes.ts"() {
    "use strict";
    init_stats_controller();
    init_auth2();
    router7 = express7.Router();
    router7.get(
      "/",
      auth_default("ADMIN" /* ADMIN */, "PROVIDER" /* PROVIDER */),
      StatsController.getStats
    );
    StatsRoutes = router7;
  }
});

// src/modules/admin/adminService.ts
var getAllUsersFromDB, updateUserRoleInDB, getAdminDashboardStats, deleteAnyMealFromDB, AdminService;
var init_adminService = __esm({
  "src/modules/admin/adminService.ts"() {
    "use strict";
    init_prisma();
    getAllUsersFromDB = async (role) => {
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
    updateUserRoleInDB = async (userId, newRole) => {
      return await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
      });
    };
    getAdminDashboardStats = async () => {
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
    deleteAnyMealFromDB = async (mealId) => {
      return await prisma.meal.delete({
        where: { id: mealId }
      });
    };
    AdminService = {
      getAllUsersFromDB,
      updateUserRoleInDB,
      getAdminDashboardStats,
      deleteAnyMealFromDB
    };
  }
});

// src/modules/admin/adminController.ts
var getAllUsers2, getStats2, deleteMeal2, AdminController;
var init_adminController = __esm({
  "src/modules/admin/adminController.ts"() {
    "use strict";
    init_adminService();
    getAllUsers2 = async (req, res) => {
      const role = req.query.role;
      const result = await AdminService.getAllUsersFromDB(role);
      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: result
      });
    };
    getStats2 = async (req, res) => {
      const result = await AdminService.getAdminDashboardStats();
      res.status(200).json({
        success: true,
        message: "Admin stats retrieved successfully",
        data: result
      });
    };
    deleteMeal2 = async (req, res) => {
      await AdminService.deleteAnyMealFromDB(req.params.id);
      res.status(200).json({
        success: true,
        message: "Meal deleted successfully by Admin"
      });
    };
    AdminController = {
      getAllUsers: getAllUsers2,
      getStats: getStats2,
      deleteMeal: deleteMeal2
    };
  }
});

// src/modules/admin/adminRoutes.ts
import express8 from "express";
var router8, AdminRoutes;
var init_adminRoutes = __esm({
  "src/modules/admin/adminRoutes.ts"() {
    "use strict";
    init_auth2();
    init_adminController();
    router8 = express8.Router();
    router8.get("/users", auth_default("ADMIN" /* ADMIN */), AdminController.getAllUsers);
    router8.get("/stats", auth_default("ADMIN" /* ADMIN */), AdminController.getStats);
    router8.delete("/meals/:id", auth_default("ADMIN" /* ADMIN */), AdminController.deleteMeal);
    AdminRoutes = router8;
  }
});

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler, globalErrorHandler_default;
var init_globalErrorHandler = __esm({
  "src/middlewares/globalErrorHandler.ts"() {
    "use strict";
    globalErrorHandler = (err, req, res, next) => {
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
    globalErrorHandler_default = globalErrorHandler;
  }
});

// src/app.ts
import express9 from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
var app, app_default;
var init_app = __esm({
  "src/app.ts"() {
    "use strict";
    init_auth();
    init_category_routes();
    init_mealRoutes();
    init_orderRoutes();
    init_user_router();
    init_providerRoutes();
    init_reviewRoutes();
    init_state_routes();
    init_adminRoutes();
    init_globalErrorHandler();
    app = express9();
    app.use(cors({
      origin: process.env.APP_URL || "http://localhost:3000",
      credentials: true
    }));
    app.use(express9.json());
    app.use("/api/users", UserRoutes);
    app.use("/api/providers", ProviderRoutes);
    app.use("/api/admin", AdminRoutes);
    app.use("/api/categories", CategoryRoutes);
    app.use("/api/meals", MealRoutes);
    app.use("/api/orders", OrderRoutes);
    app.use("/api/reviews", ReviewRoutes);
    app.use("/api/stats", StatsRoutes);
    app.use(globalErrorHandler_default);
    app.all("/api/auth/*splat", toNodeHandler(auth));
    app.get("/", (req, res) => {
      res.send("Food Delivery API is running...");
    });
    app_default = app;
  }
});

// src/server.ts
var require_server = __commonJS({
  "src/server.ts"() {
    init_app();
    init_prisma();
    var PORT = process.env.PORT || 5e3;
    async function main() {
      try {
        await prisma.$connect();
        console.log("Connected prisma successfully");
        app_default.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
        });
      } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
      }
    }
    main();
  }
});
export default require_server();
