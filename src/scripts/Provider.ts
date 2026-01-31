import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

async function seedProvider() {
    try {
        console.log(" Provider Seeding Started...");
        const providerEmail = "provider@gmail.com";
        const providerPassword = "provider12345";

        await prisma.providerProfile.deleteMany({ where: { user: { email: providerEmail } } });
        await prisma.account.deleteMany({ where: { user: { email: providerEmail } } });
        await prisma.user.deleteMany({ where: { email: providerEmail } });

        const userResponse = await auth.api.signUpEmail({
            body: {
                email: providerEmail,
                password: providerPassword,
                name: "Nandon Provider",
            },
        });

        if (userResponse) {
            console.log(" Provider User & Account created!");

            const userId = userResponse.user.id;

            await prisma.user.update({
                where: { id: userId },
                data: {
                    role: "PROVIDER", 
                    emailVerified: true,
                    status: "ACTIVE",
                    providerProfile: {
                        create: {
                            restaurantName: "Nandon Food Hub",
                            address: "Dhaka, Bangladesh",
                            phone: "01712345678"
                        }
                    }
                }
            });

            console.log(" Provider Profile created successfully!");
        }

        console.log("******* SUCCESS: PROVIDER READY ******");
    } catch (error) {
        console.error(" Provider Seeding Error:", error);
    } finally {
        process.exit();
    }
}

seedProvider();