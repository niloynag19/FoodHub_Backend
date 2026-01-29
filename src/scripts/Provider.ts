import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

async function seedProvider() {
    try {
        console.log("🚀 Provider Seeding Started...");
        const providerEmail = "provider100@gmail.com";
        const providerPassword = "provider1234";

        // ১. পুরনো ডাটা পরিষ্কার করা (যাতে কনফ্লিক্ট না হয়)
        // প্রথমে প্রোফাইল ডিলিট করতে হবে, তারপর ইউজার
        await prisma.providerProfile.deleteMany({ where: { user: { email: providerEmail } } });
        await prisma.account.deleteMany({ where: { user: { email: providerEmail } } });
        await prisma.user.deleteMany({ where: { email: providerEmail } });

        // ২. Better Auth API দিয়ে প্রোভাইডার ইউজার তৈরি
        const userResponse = await auth.api.signUpEmail({
            body: {
                email: providerEmail,
                password: providerPassword,
                name: "Nandon Provider",
            },
        });

        if (userResponse) {
            console.log("✅ Provider User & Account created!");

            // ৩. রোল আপডেট এবং প্রোফাইল তৈরি
            // userResponse থেকে সরাসরি id নিন
            const userId = userResponse.user.id;

            await prisma.user.update({
                where: { id: userId },
                data: {
                    role: "PROVIDER", // এখানে প্রোভাইডার রোল সেট হচ্ছে
                    emailVerified: true,
                    status: "ACTIVE",
                    // ৪. প্রোফাইল তৈরি (Nested Create)
                    providerProfile: {
                        create: {
                            restaurantName: "Nandon Food Hub",
                            address: "Dhaka, Bangladesh",
                            phone: "01712345678"
                        }
                    }
                }
            });

            console.log("✅ Provider Profile created successfully!");
        }

        console.log("******* SUCCESS: PROVIDER READY ******");
    } catch (error) {
        console.error("❌ Provider Seeding Error:", error);
    } finally {
        process.exit();
    }
}

seedProvider();