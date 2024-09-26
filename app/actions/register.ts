"use server"

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
            return {error: 'User already exist'}
        }

        const verificationToken = await generateVerificationToken(email)
        await sendVerificationMail(verificationToken.email, verificationToken.token)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })
    
       
        return { message: 'Confirmation mail has been sent!' };
            
    } catch (error: any) {
        // Handle server-side errors and return an appropriate error message
        return { error: 'An error occurred during login', details: error };

    }
}