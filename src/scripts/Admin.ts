import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt"
import { UserRole } from "../middlewares/auth";

async function createAdmin() {
    try {
        const adminEmail = "admin@gmail.com";

        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log("Admin already exists!");
            console.log(existingAdmin);
            return;
        }
        const hashedPassword = await bcrypt.hash("admin1234", 12);

        const newAdmin = await prisma.user.create({
            data: {
                name: "System Admin",
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.ADMIN,
                emailVerified: true,
                status: "ACTIVE"
            }
        });

        console.log(" Admin created successfully with Prisma!");
        console.log(newAdmin);

    } catch (error) {
        console.error(" Error seeding admin:", error);
    }
}

createAdmin();