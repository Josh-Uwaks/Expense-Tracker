
import * as z from "zod"

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
    .max(16, 'Password must not be greater than 16')
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


const isEmailValid = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email)
}