"use server"
// import argon from 'argon2'
import prisma from '@/prisma'
import * as z from 'zod'
import { FormSchema } from '../schemas/schema'
import { getUserByEmail } from '@/lib/ApiRequests/requests'
import bcrypt from 'bcryptjs'
import { generateVerificationToken } from '@/lib/tokenRequests/verificationTokenRequests'
import { sendVerificationMail } from '@/lib/mail/mail'

export const regAction = async (values: z.infer<typeof FormSchema>) => {
    
    const validateFields = FormSchema.safeParse(values)

    if (!validateFields.success) {

        return { error: 'Invalid fields', details: validateFields.error.errors };

    }

    try {
      
        const {email, password} = validateFields.data

        const hashedPassword = await bcrypt.hash(password, 10)

        const existingUser = await getUserByEmail(email)

        if (existingUser) {
            // throw new Error("user already exist")
            return {
                error: 'User already exist'
            }
        }

            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword
                }
            })
    
            const verificationToken = await generateVerificationToken(email)
            await sendVerificationMail(verificationToken.email, verificationToken.token)
    
                
     
            return { message: 'Confirmation mail has been sent!' };
            
        

    } catch (error: any) {
        // Handle server-side errors and return an appropriate error message
        return { error: 'An error occurred during login', details: error };

    }

    // return {error: 'field success whatever'}
}