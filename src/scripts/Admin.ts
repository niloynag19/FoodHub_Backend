import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
    try {
        const adminEmail = "admin1@gmail.com";
        const existingUser = await prisma.user.findUnique({
            where:{
                email:adminEmail
            }
        })
        if(existingUser)
        {
            console.log("User already exits");
        }
        const hashedAdminPassword = await bcrypt.hash("admin1234", 12);

        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                name: "System Admin",
                email: adminEmail,
                password: hashedAdminPassword,
                role: UserRole.ADMIN,
                emailVerified: true,
                status: "ACTIVE"
            }
        });
        console.log(" Admin successfully processed:", admin.email);
    } catch (error) {
        console.error(" Admin Seeding failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();