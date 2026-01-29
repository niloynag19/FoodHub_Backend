import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
    try {
        console.log("🚀 Seeding Started...");
        const adminEmail = "admin2@admin.com";
        const adminPassword = "admin1234";

        await prisma.account.deleteMany({ where: { user: { email: adminEmail } } });
        await prisma.user.deleteMany({ where: { email: adminEmail } });

        const user = await auth.api.signUpEmail({
            body: {
                email: adminEmail,
                password: adminPassword,
                name: "Admin Saheb",
            },
        });

        if (user) {
            await prisma.user.update({
                where: { email: adminEmail },
                data: {
                    role: "ADMIN",
                    emailVerified: true,
                    status: "ACTIVE",
                }
            });
            console.log(" Admin created with Account credentials!");
        }

        console.log("******* SUCCESS ******");
    } catch (error) {
        console.error(" Error:", error);
    } finally {
        process.exit();
    }
}

seedAdmin();