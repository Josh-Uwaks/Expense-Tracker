"use client"

import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { RegistrationInput, FormSchema } from "@/app/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { regAction } from "@/app/actions/register";
import { Card } from "@/components/ui/card";
import React from "react";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { signIn } from "next-auth/react";

export default function Registration() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RegistrationInput>({
        resolver: zodResolver(FormSchema)
    });

    const [isPending, startTransition] = useTransition();
    const [isGoogleLoading, setGoogleLoading] = React.useState(false); // State to track Google button loading


    const onSubmit: SubmitHandler<RegistrationInput> = async (data) => {
        startTransition(async () => {
            const response = await regAction(data);
            console.log(response)

            if (response?.message) {
                reset()
                toast({
                    variant: 'default',
                    title: "Success",
                    description: response.message
                });
            } else if (response?.error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: response.error || response.details || "An unexpected error occurred",
                });
            }
        });
    }

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true); // Start loading
        // Simulate a delay for demonstration
        setTimeout(() => {
            // Replace with your sign-in logic
            setGoogleLoading(false); // Stop loading
            // Optionally add your sign-in function here
            signIn('google')
        }, 1000);
    }
    
    
    return (
        <div className="grid lg:grid-cols-12 min-h-screen text-[14px]">
            <div className="relative hidden items-end bg-gray-900 lg:col-span-6 lg:h-full md:flex">
                <img
                    alt=""
                    src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=3008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
            </div>

            <div className="lg:col-span-6 flex justify-center items-center">
                <Card className="p-8 bg-white rounded-[16px] min-w-[430px] shadow-md border-none">
                    <h1 className="text-2xl font-bold text-gray-800">Sign Up</h1>
                    <p className="text-gray-600">to continue with our Expense Tracker</p>

                    <form className="my-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input {...register("email")} type="email" id="email" className="mt-1 border border-gray-300 focus:ring focus:ring-blue-400" />
                            {errors.email && <div className="text-red-500 mt-1">{errors.email.message}</div>}
                        </div>

                        <div className="my-3">
                            <Label htmlFor="password">Password</Label>
                            <Input {...register("password")} type="password" id="password" className="mt-1 border border-gray-300 focus:ring focus:ring-blue-400" />
                            {errors.password && <div className="text-red-500 mt-1">{errors.password.message}</div>}
                        </div>

                        <div>
                            <Label htmlFor="confirmpassword">Confirm Password</Label>
                            <Input {...register('confirm_password')} type="password" id="confirmpassword" className="mt-1 border border-gray-300 focus:ring focus:ring-blue-400" />
                            {errors.confirm_password && <div className="text-red-500 mt-1">{errors.confirm_password.message}</div>}
                        </div>

                        <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-teal-400 text-white hover:scale-105 transition-transform" disabled={isPending || isSubmitting}>
                            {isPending || isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>

                    <div className="relative mt-12 pb-12 border-t border-gray-300"> 
                        <div className="bg-white absolute left-1/2 -mt-[26px] transform -translate-x-1/2 p-4 rounded-full">or</div>
                    </div>

                    <div 
                        className={`flex gap-2 p-3 rounded-md border border-gray-300 cursor-pointer transition-all duration-200 
                                    hover:bg-gray-200 active:bg-gray-300 transform ${isGoogleLoading ? 'scale-95' : 'scale-100'}`} // Scale on active
                        onClick={handleGoogleSignIn}
                    >
                        <FcGoogle size={20} />
                        <p className="text-gray-800">{isGoogleLoading ? "Loading..." : "Continue with Google"}</p>
                    </div>

                    <div className="mt-4 text-gray-600">
                        No account? <Link href={'/auth/login'} className="text-blue-600 hover:underline">Sign In</Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
