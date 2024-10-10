
import * as z from "zod"
import { UserRoles } from "@prisma/client"

export const SettingsSchema = z.object({

    username: z.optional(z.string()),
    firstname: z.optional(z.string()),
    lastname: z.optional(z.string()),
    email: z.optional(z.string().email()),
    mobilenumber: z.optional(z.string()),
    role: z.optional(z.enum([UserRoles.ADMIN, UserRoles.USER])),
    password: z.optional(z.string()),
    new_password: z.optional(z.string()),
    isTwofactorEnabled: z.optional(z.boolean()),
})

export const FormSchema = z.object({
    email: z.string().email(),
    password: z.string()
    .min(3, 'Password must not be lesser than 3')
    .max(16, 'Password must not be greater than 16'),
    confirm_password: z.string()
    .min(3, 'Confirm password must not be lesser than 3')
    .max(16, 'Confirm password must not be greater than 16')
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ['confirm password']
})

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
    .min(3, 'Password must not be lesser than 3')
    .max(16, 'Password must not be greater than 16'),
    code: z.optional(z.string())
})

export const ResetEmailSchema = z.object({
    email: z.string().email({
        message: "Email is required!!!"
    })
})

export const ResetPasswordSchema = z.object({
    password: z.string()
    .min(3, "Password must not be lesser than 3")
    .max(16, "Password must not be greater than 16"),
    confirm_password: z.string()
    .min(3, "Confirm password must not be lesser than 3")
    .max(16, "Confirm password must not be greater than 16")
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ['confirm password']
})

export const ReportDateSchema = z.object({
    first_date_entry: z.date({
        required_error: "An entry date is required."
    }),
    second_date_entry: z.date({
        required_error: "Second date entry is also required"
    })
})


export type DateSchema = z.infer<typeof ReportDateSchema>
export type RegistrationInput = z.infer<typeof FormSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type ResetInput = z.infer<typeof ResetEmailSchema>
export type ResetPasswordInputs = z.infer<typeof ResetPasswordSchema>
export type SettingsInput = z.infer<typeof SettingsSchema>
// const isEmailValid = (email: string) => {
//     const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
//     return emailRegex.test(email)
// }