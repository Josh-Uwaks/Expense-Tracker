import prisma from "@/prisma";


export const verificationTokenByEmail = async (email: string) => {

        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                email: email
            }
        })

        console.log(verificationToken)

        return verificationToken

}