"use server"

import { ResetPasswordSchema, ResetPasswordInputs } from "../schemas/schema"
import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { getResetToken } from "@/lib/tokenRequests/resetTokenRequests"
import prisma from "@/prisma"
import { getUserByEmail } from "@/lib/ApiRequests/requests"


export const ResetPasswordAction = async (values: z.infer<typeof ResetPasswordSchema>, token?: string | null) => {

    const validateFields = ResetPasswordSchema.safeParse(values)

    // check if the validations using the form hook is successfull else we shoot an error
    if(!validateFields.success) {
        return {error: "Invalid Fields"}
    }

    // we check if the token coming from the client side is true else we shoot an error indicating that the token is missing
    if(!token) {
        return {error: "Missing Token"}
    }
    const {password} = validateFields.data

    const hashedPassword = await bcrypt.hash(password, 10)

    const checkExistingToken = await getResetToken(token)

    if(!checkExistingToken) {
        return {error: "Invalid Token!"}
    }


    const hasExpired = new Date(checkExistingToken.expires) < new Date()

    if(hasExpired) {
        return {error: "Token has expired!!"}
    }

    const userEmail = await getUserByEmail(checkExistingToken.email)

    if(!userEmail) {
        return {error: 'Invalid Email'}
    }

    console.log({
        "Email": userEmail
    })

    await prisma.user.update({
        where: { email: checkExistingToken.email},
        data: {password: hashedPassword}
    })

    await prisma.resetVerificationToken.delete({
        where: {id: checkExistingToken.id}
    })

    return {
        success: "Password has been updated successfully"
    }

}