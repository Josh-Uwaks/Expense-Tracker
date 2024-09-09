import Google from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./app/schemas/schema"
import { getUserByEmail } from "./lib/ApiRequests/requests"
import bcrypt from 'bcryptjs'
 
export default { providers: [
    Google, 
    CredentialsProvider({
        async authorize(credentials) {
            const validateFields = LoginSchema.safeParse(credentials)

            if(validateFields.success) {
                const {email, password} = validateFields.data

                
                const user = await getUserByEmail(email)

                if(!user || !user.password) return null

                const isPasswordValid = await bcrypt.compare(password, user.password)

                if (isPasswordValid) return user
            }

            return null
        }
    })
] } satisfies NextAuthConfig



// import { AuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import prisma from "@/prisma/index";
// import bcrypt from 'bcrypt';

// export const authOptions: AuthOptions = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID as string,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//         }),
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email"},
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 if (!credentials?.email || !credentials?.password) {
//                     throw new Error("Missing Credentials");
//                 }

//                 const user = await prisma.user.findUnique({
//                     where: { email: credentials.email },
//                 });

//                 if (!user || !user.password) {
//                     throw new Error("User not registered");
//                 }

//                 const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

//                 if (!isPasswordValid) {
//                     throw new Error("Invalid Credentials");
//                 }

//                 return user;
//             },
//         }),
//     ],
//     secret: process.env.NEXTAUTH_SECRET,
//     session: {
//         strategy: "jwt",
//     },
//     pages: {
//         signIn: "/auth/signin",
//     },
//     callbacks: {
       
//         async session({ session, token, user }) {
//             // Attach user ID to the session
//             if (token?.sub) {
//                 session.user.id = token.sub;
//             }

//             return session;
//         },
//         async jwt({ token, user, account, profile }) {
//             // Attach user ID to the JWT token
//             if (user) {
//                 token.sub = (user as any).id;
//             }
//             return token;
//         },
//     },
//     debug: process.env.NODE_ENV !== "production",
// };
