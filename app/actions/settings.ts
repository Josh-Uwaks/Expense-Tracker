"use server"

import {signedUserServer} from '../../hooks/signedUserServer'
import {SettingsSchema} from '../schemas/schema'
import * as z from 'zod'
import {getUserByEmail, getUserById} from '../../lib/ApiRequests/requests'
import prisma from '@/prisma'
import { generateVerificationToken } from '@/lib/tokenRequests/verificationTokenRequests'
import { sendVerificationMail } from '@/lib/mail/mail'
import bcrypt from 'bcryptjs'

export const SettingsAction = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await signedUserServer()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const dbUser = await getUserById(user.id)

    if (!dbUser) {
        return { error: 'Unauthorized' }
    }

    if (user?.isOAuth) {
        values.email = undefined
        values.password = undefined
        values.new_password = undefined
        values.isTwofactorEnabled = undefined
    }

    if (values.email && values.email !== user.email) {
        const checkEmailExists = await getUserByEmail(values.email)

        if (checkEmailExists && checkEmailExists.id !== user.id) {
            return { error: 'Email Already Exists' }
        }

        const verificationToken = await generateVerificationToken(values.email)
        await sendVerificationMail(verificationToken.email, verificationToken.token)

        return { message: 'Verification mail has been sent!!' }
    }

    if (values.password && values.new_password && dbUser.password) {
        const comparePasswords = await bcrypt.compare(values.password, dbUser.password)
        if (!comparePasswords) {
            return { error: 'Incorrect Password' }
        }

        const hashedPassword = await bcrypt.hash(values.new_password, 10)

        // Replace the current password with the hashed password
        values.password = hashedPassword

        // Remove new_password from values as it's no longer needed
        delete values.new_password
    } else {
        // If no password update, ensure password field is not sent
        delete values.password
        delete values.new_password
    }

    await prisma.user.update({
        where: {
            id: dbUser.id
        },
        data: {
            ...values
        }
    })

    return { success: 'Settings Updated' }
}
