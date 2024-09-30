import prisma from "@/prisma"
import crypto from 'crypto'

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const getToken = await prisma.twoFactorToken.findUnique({
            where: {
                token: token
            }
        })

        return getToken
    } catch (error) {
        return null
    }
}


export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const getEmail = await prisma.twoFactorToken.findFirst({
            where: {
                email: email
            }
        })

        return getEmail
    } catch (error) {
        return null
    }
}


export const getTwoFactorConfirmation = async (userId: string) => {
    try {
        const getConfirmation = await prisma.twoFactorConfirmation.findUnique({
            where: {
                userId: userId
            }
        })
        return getConfirmation
    } catch (error) {
        return null
    }
}

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString()
    const expires = new Date(new Date().getTime() + 5 * 180 * 1000)

    const existingToken = await getTwoFactorTokenByToken(email)

    if(existingToken) {
        await prisma.twoFactorToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return twoFactorToken

}