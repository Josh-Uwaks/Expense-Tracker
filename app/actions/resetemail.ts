"use server"

import { ResetInput, ResetEmailSchema } from "../schemas/schema"
import * as z from 'zod'
import prisma from "@/prisma"
import { generateResetVerificationToken } from "@/lib/tokenRequests/resetTokenRequests"
import { sendPasswordResetMail } from "@/lib/mail/mail"


export const ResetAction = async (values: z.infer<typeof ResetEmailSchema>) => {

    const validateFields = ResetEmailSchema.safeParse(values)

    if(!validateFields.success) {
        return {error: "Invalid Input", details: validateFields.error.errors}
    }

    const {email} = validateFields.data

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(!existingUser) {
        return { error: "Email Not Found"}
    }

    const passwordResetToken = await generateResetVerificationToken(email)
    await sendPasswordResetMail(passwordResetToken.email, passwordResetToken.token)


    return { success: "Reset Link has been sent"}

}