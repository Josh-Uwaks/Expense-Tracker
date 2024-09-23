"use client"

import React from "react"
import {Card} from '@/components/ui/card'
import { useForm, SubmitHandler } from "react-hook-form"
import { ResetInput, ResetEmailSchema } from "@/app/schemas/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ResetAction } from "@/app/actions/resetemail"
import { toast } from "@/hooks/use-toast"

export default function ResetPage() {

    const {register, handleSubmit, reset, formState: {errors, isSubmitting} } = useForm<ResetInput>({
        resolver: zodResolver(ResetEmailSchema)
    })

    const [isPending, startTransition] = useTransition()
 

    const onSubmit: SubmitHandler<ResetInput> = async (data) => {


        startTransition(async () => {
            const response = await ResetAction(data);

            console.log(response)
            // Check if response has success property
            if ('success' in response && response.success) {
                // window.location.href = defaultLoginRedirect; 

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
        });

    }

    return(
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
                    <h1 className="text-2xl font-bold">Reset Email</h1>
                    <p>Forgot your credentials kindly reset</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input {...register("email")} type="email" id="email" className="mt-1"/>
                        </div>

                        {errors.email && <div className="text-red-500 mt-3">{errors.email.message}</div>}

                        <Button className="w-full mt-6"> {isSubmitting ? "Submitting..." : "Send Resend Email"}</Button>
                    </form>

                    <Link href="/auth/login" className='mt-4'>Back to Login</Link>
                   
                </Card>

            </div>

        </div>
        </>
    )
}