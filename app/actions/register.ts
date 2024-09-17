"use server"
// import argon from 'argon2'
import prisma from '@/prisma'
import * as z from 'zod'
import { FormSchema } from '../schemas/schema'
import { getUserByEmail } from '@/lib/ApiRequests/requests'
import bcrypt from 'bcryptjs'
import { generateVerificationToken } from '@/lib/verificationTokens/generateToken'

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

        const tokenrequest = await generateVerificationToken(email)

            
 
        return { message: 'Registration is successful' };

    } catch (error: any) {
        // Handle server-side errors and return an appropriate error message
        return { error: 'An error occurred during login', details: error.message };

    }

    // return {error: 'field success whatever'}
}