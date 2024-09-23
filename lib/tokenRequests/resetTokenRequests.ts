import prisma from '@/prisma'
import {v4 as uuidv4} from 'uuid'


// used to obtain the reset email from the schema
export const getResetUserEmail = async (email: string) => {
    const ResetEmail = await prisma.resetVerificationToken.findFirst({
        where: {
            email: email
        }
    })

    return ResetEmail
}


// used to obtain the token in the resetverification schema
export const getResetToken = async (token: string) => {
    try {

        const userToken = await prisma.resetVerificationToken.findUnique({
            where: {
                token: token
            }
        })

        return userToken

    } catch {
        return null
    }
}


// Token is generated and sent to the schema for verification
export const generateResetVerificationToken = async(email: string) => {

    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

  try {
    const existingToken = await getResetUserEmail(email)

    if(existingToken) {
        await prisma.resetVerificationToken.delete({
            where: {
                id: existingToken?.id
            }
        })
    }

    const verification = prisma.resetVerificationToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return verification

  } catch (error) {

    console.log(error)
    throw new Error("something went wrong")

  }
}