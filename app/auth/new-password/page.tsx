"use client"

import { ResetPasswordAction } from "@/app/actions/resetpassword"
import { ResetPasswordInputs, ResetPasswordSchema } from "@/app/schemas/schema"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useTransition } from "react"
import {useForm, SubmitHandler} from 'react-hook-form'
import { useSearchParams } from "next/navigation"
import * as z from 'zod'



function NewPassword() {


    const params = useSearchParams()
    const token = params.get('token')

    console.log(token)

    const [isPending, startTransition] = useTransition()


    const {register, reset, handleSubmit, setError, formState: {errors, isSubmitting}} = useForm<ResetPasswordInputs>({
        resolver: zodResolver(ResetPasswordSchema)
    })

    const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {

        startTransition(async () => {

            const response = await ResetPasswordAction(data, token);

            console.log(response)

            // Check if response has success property
            if ('success' in response && response.success) {

                reset()

                toast({
                    variant: 'default',
                    title: "Success",
                    description: response.success
                })


            } else {
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: response.error
                });
            }
        })

    } 



    return (
        <>
        <div className="grid lg:grid-cols-12 min-h-screen text-[14px]">

            <div className="relative flex items-end bg-gray-900 lg:col-span-6 lg:h-full">
                <img
                    alt=""
                    src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=3008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
            </div>

            <div className="lg:col-span-6 flex justify-center items-center">
                <Card className="p-8 bg-white rounded-[16px] min-w-[430px] flex flex-col items-center gap-3 shadow-md border-none">
                    <h1 className="text-2xl font-bold">Reset Password</h1>
                    <p>Enter new password and submit</p>

                    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                        <div className="my-3">
                            <Label htmlFor="password">Password</Label>
                            <Input {...register("password")} type="password"  id="password" className="mt-1"/>
                        </div>

                        {errors.password && <div className="text-red-500">{errors.password.message}</div>}

                        <div>
                            <Label htmlFor="confirmpassword">Confirm Password</Label>
                            <Input {...register('confirm_password')} type="password" id="confirmpassword" className="mt-1"/>
                        </div>

                        {errors.confirm_password && <div className="text-red-500 mt-3">{errors.confirm_password.message}</div>}
                        {errors.root && <div>{errors.root.message}</div>}

                        <Button className="mt-6 w-full">{isSubmitting ? "Submitting" : "Reset Password"}</Button>

                    </form>

                    <Link href="/auth/login" className='mt-4'>Back to Login</Link>
                </Card>

            </div>

        </div>
        </>
    )
}

export default NewPassword