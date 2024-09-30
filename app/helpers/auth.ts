import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma"; // Your Prisma client instance
import { getUserById } from "@/lib/ApiRequests/requests";
import authConfig from "@/auth.config";
import { UserRoles } from "@prisma/client";
import { AdapterUser } from "next-auth/adapters"; // Import AdapterUser
import { getTwoFactorConfirmation } from "@/lib/tokenRequests/TwoFactorToken";

// Define a custom user type
type CustomUser = AdapterUser & {
  role: UserRoles; // Add role property
};

export const {handlers, auth, signIn, signOut} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error"
  },
  events: {
    async linkAccount({user}) {

      await prisma.user.update({

        where: {
          id: user.id
        },

        data: {
          emailVerified: new Date()
        }
        
      })
    }
  },
  
  callbacks: {

    async signIn({user, account}) {

      // if the provider is not equal to credentials then true
      if(account?.provider !== "credentials") return true

      // to get the signed in user information.
      const existingUser = await getUserById(user.id)

      // to confirm if the mail is verified
      if(!existingUser?.emailVerified) return false

      // to confirm the 2FA
      if(existingUser.isTwofactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmation(existingUser.id)
        if(!twoFactorConfirmation) return false

        // to delete the 2fa
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id
          }
        })

      }
      
      return true

      // EXPLANATIONS.
      // 1. We first check if the provider is not credentials reason is because we assume providers like google, github and all handles the verification process correctly.
      // 2. we then proceed to extract the users information using the getUserById function.
      // 3. after extracting user's info we check if the email is verified.
      // 4. we also check if the 2fa is enabled because we set this as boolean in the schema.
      // 5. if its true then we execute the block of code situated in it in this case we confirm using the getTwoFactorConfirmation function, if the confirmation is successful we automatically delete the the user from the confirmation schema.
      
    },

    async session({token, session}){

      if(token.sub && session.user) {
        (session.user as CustomUser).id = token.sub; // Cast to CustomUser
      }

      if(session.user && token.role) {
        (session.user as CustomUser).role = token.role as UserRoles; // Cast to CustomUser
      }

      console.log({
        sessionToken: token,
        session
      })
      
      return session;

    },
    async jwt({token}){

      if(!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if(!existingUser) return token

      token.role = existingUser.role

      console.log(token)

      return token
    }
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  ...authConfig
});


