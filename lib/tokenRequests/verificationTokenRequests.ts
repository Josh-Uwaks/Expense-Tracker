import prisma from "@/prisma"
import {v4 as uuidv4} from 'uuid'


// Get token using the user's email
export const getTokenByEmail = async (email: string) => {
    const verificationToken = await prisma.verificationToken.findFirst({
        where: {
            email: email
        }
    })
    
    return verificationToken

}

// Get token by token
export const getToken = async (token: string) => {
    try {
        const existingToken = await prisma.verificationToken.findUnique({
            where: {
                token: token
            }
        })
        return existingToken
    } catch {
        return null
    }
}


// Token is generated and sent to the schema for verification
export const generateVerificationToken = async(email: string) => {

    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)

  try {
    const existingToken = await getTokenByEmail(email)

    if(existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken?.id
            }
        })
    }

    const verification = prisma.verificationToken.create({
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