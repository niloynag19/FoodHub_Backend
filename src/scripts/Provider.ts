import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { UserRole } from "../middlewares/auth";

async function seedProvider() {
    try {
        const providerEmail = "provider@gmail.com";
        const hashedProviderPassword = await bcrypt.hash("provider1234", 12);

        const provider = await prisma.user.upsert({
            where: { email: providerEmail },
            update: {}, 
            create: {
                name: "Niloy's Kitchen",
                email: providerEmail,
                password: hashedProviderPassword,
                role: UserRole.PROVIDER,
                emailVerified: true,
                status: "ACTIVE",
                providerProfile: {
                    create: {
                        restaurantName: "Food Hub Central",
                        address: "Dhaka, Bangladesh",
                        phone: "01712345678",
                    }
                }
            }
        });
        console.log(" Provider successfully processed:", provider.email);
    } catch (error) {
        console.error(" Provider Seeding failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedProvider();