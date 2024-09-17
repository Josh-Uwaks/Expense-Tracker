import Google from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./app/schemas/schema"
import { getUserByEmail } from "./lib/ApiRequests/requests"
// import argon2 from 'argon2'
import bcrypt from 'bcryptjs'
 


export default { 

    providers: [
    Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET
    }), 

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
] 
} satisfies NextAuthConfig



