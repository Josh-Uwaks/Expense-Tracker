"use server"

import { getUserByEmail } from "@/lib/ApiRequests/requests"
import {getToken} from '@/lib/tokenRequests/verificationTokenRequests'
import prisma from "@/prisma"


export const tokenVerification = async (token: string) => {

   const existingToken = await getToken(token)

   if(!existingToken) {
    return {error: "Token does not exist"}
   }

   const hasExpired = new Date(existingToken.expires) < new Date()

   if(hasExpired) {
    return {error: "Token has expired"}
   }

   const userEmail = await getUserByEmail(existingToken.email)

   if(!userEmail) {
    return {error: "Email does not exist"}
   }

   await prisma.user.update({
       where: { id: userEmail.id},
       data: {
           emailVerified: new Date(),
           email: existingToken.email
       }
   });

   await prisma.verificationToken.delete({
    where: {id: existingToken.id}
   })

   return {success: "Email Verified"}

}