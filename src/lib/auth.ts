import { betterAuth, string } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    trustedOrigins: [process.env.APP_URL!],
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
        autoSignIn: false,
        requireEmailVerification: false,
    },
    emailVerification: {
        sendOnSignUp:true,
        autoSignInAfterVerification:true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

                const info = await transporter.sendMail({
                    from: '"Food Hub" <foodhub@gmail.com>',
                    to: user.email,
                    subject: "Please Verify Your Email ✅",
                    text: `Hi ${user.name},\n\nPlease verify your email by clicking the link: ${verificationUrl}\n\nThank you,\nFood Hub Team`,
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
            &copy; ${new Date().getFullYear()} Food Hub. All rights reserved.
        </p>
    </div>
    `,
                });

                console.log("Verification email sent:", info.messageId);
            } catch (error) {
                console.error(error)
                throw error;
            }

        },
    },
    socialProviders: {
        google: { 
            prompt:"select_account consent",
            accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});