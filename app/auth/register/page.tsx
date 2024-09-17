"use client"

import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {SubmitHandler, useForm} from "react-hook-form"
import { RegistrationInput, FormSchema } from "@/app/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { regAction } from "@/app/actions/register";
import { Card } from "@/components/ui/card";
import React from "react";
import { toast } from "@/hooks/use-toast";


export default function Registration(){


    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<RegistrationInput>({
        resolver: zodResolver(FormSchema)
    })
    const onSubmit: SubmitHandler<RegistrationInput> = async (data) => {
        try {
            const response = await regAction(data)
            toast({
                variant: 'default',
                title: 'Success',
                description: response.message
            })

            return response
            
        } catch (error) {
            console.log(error)
        }
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
                    <Card className="p-8 bg-white rounded-[16px] min-w-[430px] shadow-md border-none">
                        <h1 className="text-2xl font-bold">Sign Up</h1>
                        <p>to continue with our Expense Tracker</p>

                        <form className="my-6" onSubmit={handleSubmit(onSubmit)}>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input {...register("email")} type="email" id="email" className="mt-1"/>
                            </div>

                            {errors.email && <div className="text-red-500">{errors.email.message}</div>}

                            <div className="my-3">
                                <Label htmlFor="password">Password</Label>
                                <Input {...register("password")} type="password"  id="password" className="mt-1"/>
                            </div>

                            <div>
                                <Label htmlFor="confirmpassword">Confirm Password</Label>
                                <Input {...register('confirm_password')} type="password" id="confirmpassword" className="mt-1"/>
                            </div>

                            <Button className="w-full mt-6"> {isSubmitting ? "Submitting..." : "Submit"}</Button>
                        </form>


                        <div className="relative mt-12 pb-12 border-t border-input"> 
                            <div className="bg-white absolute left-1/2 -mt-[26px] transform -translate-x-1/2 p-4 rounded-full">or</div>
                        </div>

                        <div className="flex gap-2 p-3 rounded-md border border-input hover:bg-[#dcdcdc] cursor-pointer">
                            <FcGoogle size={20}/>
                            <p>Continue with Google</p>
                        </div>

                        <div className="mt-4">No account ? <Link href={'/auth/login'} className="">Sign In</Link></div>
                    </Card>
                </div>
            </div>
        </>
    )
}