import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { deleteAccountEmail, resetPasswordEmail, verifyEmailTemplate } from "@/lib/email-templates";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            void sendEmail({
                to: user.email,
                subject: "Reset your Spectrum password",
                text: `Click the link to reset your password: ${url}`,
                html: resetPasswordEmail(url),
            });
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            void sendEmail({
                to: user.email,
                subject: "Verify your Spectrum email",
                text: `Click the link to verify your email: ${url}`,
                html: verifyEmailTemplate(url),
            });
        },
        sendOnSignUp: true,
    },
    user: {
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }) => {
                void sendEmail({
                    to: user.email,
                    subject: "Confirm account deletion",
                    text: `Click the link to confirm account deletion: ${url}`,
                    html: deleteAccountEmail(url),
                });
            },
        },
    },

    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            scope: ["read:user", "user:email"],
            mapProfileToUser: (profile) => ({
                name: profile.name ?? profile.login ?? "",
                image: profile.avatar_url ?? null,
            }),
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            scope: ["openid", "email", "profile"],
            mapProfileToUser: (profile) => ({
                name: profile.name ?? profile.given_name ?? profile.email ?? "",
                image: profile.picture ?? null,
            }),
        },
    },
    plugins: [],
});



