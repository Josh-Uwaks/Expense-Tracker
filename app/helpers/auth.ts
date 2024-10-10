import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/prisma"; // Your Prisma client instance
import { getUserById } from "@/lib/ApiRequests/requests";
import authConfig from "@/auth.config";
import { UserRoles } from "@prisma/client";
import { getTwoFactorConfirmation } from "@/lib/tokenRequests/TwoFactorToken";
import { getAccountByUserId } from "@/lib/accountRequests/requests";
import { ExtendedUser } from "@/next-auth";

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

    async session({ token, session }) {
    // Cast session.user to ExtendedUser to include the additional properties
    const extendedUser = session.user as unknown as ExtendedUser;

    // Populate extendedUser properties from the token
    if (token.sub) {
        extendedUser.id = token.sub; // Set user ID from the token
    }

    if (token.role) {
        extendedUser.role = token.role as UserRoles; // Set user role from the token
    }

    if (token.email) {
        extendedUser.email = token.email; // Set email from the token
    }

    if (typeof token.isOAuth === 'boolean') {
        extendedUser.isOAuth = token.isOAuth; // Set isOAuth from the token
    }

    if(session.user) {
      extendedUser.isTwofactorEnabled = token.isTwofactorEnabled as boolean
      extendedUser.name = token.name || "Unknown"; 
      extendedUser.image = token.picture || ""; 
    }

    if(session.user && token.lastname){
      extendedUser.lastname = token.lastname as string
    }

    if(session.user && token.firstname){
      extendedUser.firstname = token.firstname as string
    }

    if(session.user && token.username) {
      extendedUser.username = token.username as string
    }

    if(session.user && token.mobilenumber){
      extendedUser.mobilenumber = token.mobilenumber as string
    }

    extendedUser.emailVerified = token.emailVerified instanceof Date
    ? token.emailVerified
    : null;

     // Debug logging
  //    console.log({
  //     "session is": session,
  //     "token": token,
  //     "extended user is": extendedUser
  // });

    session.user = extendedUser; 

    return session; // Return the updated session
},
    async jwt({token}){

      if(!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token; // Ensure existingUser is defined before proceeding

      const existingAccount = await getAccountByUserId(existingUser.id) // Now safe to access id

      if(!existingUser) return token


      // we check this details from user schema and pass down to the token
      token.role = existingUser.role
      token.email = existingUser.email
      token.firstname = existingUser.firstname
      token.name = existingUser.name ?? "Unknown"
      token.isTwofactorEnabled = existingUser.isTwofactorEnabled
      token.emailVerified = existingUser.emailVerified ?? null
      token.mobilenumber = existingUser.mobilenumber
      token.username = existingUser.username
      token.lastname = existingUser.lastname

      // we check from account schemas for external providers like google etc and we pass to token as boolean
      token.isOAuth = !!existingAccount

      
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


