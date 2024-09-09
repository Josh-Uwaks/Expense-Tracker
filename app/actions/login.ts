"use server"
import * as z from 'zod'
import { LoginSchema, LoginInput } from '../schemas/schema'
import { signIn } from '../helpers/auth'
import {AuthError} from 'next-auth'
import { defaultLoginRedirect } from '@/route'

export const LoginAction = async (values:z.infer<typeof LoginSchema> ) => {
    const validateFields = LoginSchema.safeParse(values)

    if(!validateFields.success) {
        return {error: 'Invalid fields', details: validateFields.error.errors}
    }

    const {email, password} = validateFields.data

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false
        })

        return {success: true}
    } catch (error: any) {
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