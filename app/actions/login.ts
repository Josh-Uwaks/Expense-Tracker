"use server"
import * as z from 'zod'
import { LoginSchema } from '../schemas/schema'
// import { signIn } from 'next-auth/react'
import { signIn } from '../helpers/auth'
import {AuthError} from 'next-auth'
import { generateVerificationToken } from '@/lib/tokenRequests/verificationTokenRequests'
import { getUserByEmail } from '@/lib/ApiRequests/requests'
import { sendTwoFactorMail, sendVerificationMail } from '@/lib/mail/mail'
import { generateTwoFactorToken, getTwoFactorConfirmation, getTwoFactorTokenByEmail } from '@/lib/tokenRequests/TwoFactorToken'
import { defaultLoginRedirect } from '@/route'

export const LoginAction = async (
    values:z.infer<typeof LoginSchema>,
    callbackUrl?: string
 ) => {
    const validateFields = LoginSchema.safeParse(values)

    if(!validateFields.success) {
        return {error: 'Invalid fields', details: validateFields.error.errors}
    }

    const {email, password, code} = validateFields.data


    const existingUser = await getUserByEmail(email)

    if(!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "Email doest not Exist"}
    }

    if (!existingUser.emailVerified) {
        const verification = await generateVerificationToken(existingUser.email)
        await sendVerificationMail(verification.email, verification.token)
        return {message: "Confirmation Email has been sent"}
    }

    if(existingUser.isTwofactorEnabled && existingUser.email) {
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            if(!twoFactorToken) {
                return {error: "invalid code - 1"}
            }

            if(twoFactorToken.token !== code) {
                return {error: "Invalid code - 2"}
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            if(hasExpired) {
                return {error: 'Token has Expired'}
            }

            await prisma?.twoFactorToken.delete({
                where: {
                    id: twoFactorToken.id
                }
            })

            const existingConfirmation = await getTwoFactorConfirmation(existingUser.id)

            if(existingConfirmation) {
                await prisma?.twoFactorConfirmation.delete({
                    where: {
                        id: existingConfirmation.id
                    }
                })
            }

            await prisma?.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })
            

        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorMail(twoFactorToken.email, twoFactorToken.token)
    
            return {twoFactor: true}
        }
    }

    try {
         await signIn("credentials", {
            email,
            password,
            redirect: false
        })

        return {success: true}
        
    } catch (error: any) {
        console.log(error)
        if(error instanceof AuthError) {
            switch(error.type) {
                case "CredentialsSignin": 
                    return {error: "Invalid Credentials", details: "the email or password you entered is incorrect."} 
                default: 
                    return {error: "Something went wrong", details: error.message}
            }
        }

        return {error: "Unexpected error", details: error.message} // Catch-all for unexpected errors
    }
}