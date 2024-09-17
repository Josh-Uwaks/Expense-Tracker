import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma"; // Your Prisma client instance
import { getUserById } from "@/lib/ApiRequests/requests";
import authConfig from "@/auth.config";
import { UserRoles } from "@prisma/client";
import { AdapterUser } from "next-auth/adapters"; // Import AdapterUser

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

      if(account?.provider !== "credentials") return true

      const existingUser = await getUserById(user.id)

      if(!existingUser?.emailVerified) return false
      
      return true
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


