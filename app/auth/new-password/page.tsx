"use client";

import { ResetPasswordAction } from "@/app/actions/resetpassword";
import { ResetPasswordInputs, ResetPasswordSchema } from "@/app/schemas/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Suspense, useTransition } from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import { useSearchParams } from "next/navigation";

function NewPassword() {
    const params = useSearchParams();
    const token = params.get('token');
    
    const [isPending, startTransition] = useTransition();

    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordInputs>({
        resolver: zodResolver(ResetPasswordSchema)
    });

    const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
        startTransition(async () => {
            const response = await ResetPasswordAction(data, token);
            // Check if response has success property
            if (response?.success) {
                reset();
                window.location.href = '/auth/login';
                toast({
                    variant: 'default',
                    title: "Success",
                    description: response.success
                });
            } else if (response?.error) {
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: response.error
                });
            }
        });
    };

    return (
        <Suspense fallback={<div>Loading....</div>}>
            <div className="grid lg:grid-cols-12 min-h-screen text-[14px]">
                <div className="relative hidden md:flex items-end bg-gray-900 lg:col-span-6 lg:h-full">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=3008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                </div>

                <div className="lg:col-span-6 flex justify-center items-center">
                    <Card className="p-8 bg-white rounded-[16px] min-w-[430px] flex flex-col items-center gap-6 shadow-lg border-none">
                        <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
                        <p className="text-gray-600">Enter your new password and submit</p>

                        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                            <div className="my-4">
                                <Label htmlFor="password" className="block text-gray-700">Password</Label>
                                <Input 
                                    {...register("password")}
                                    type="password"
                                    id="password"
                                    className="mt-1 border border-gray-300 focus:ring focus:ring-blue-300 focus:border-blue-500 rounded-md p-2" 
                                />
                                {errors.password && <div className="text-red-500 mt-2">{errors.password.message}</div>}
                            </div>

                            <div className="my-4">
                                <Label htmlFor="confirmpassword" className="block text-gray-700">Confirm Password</Label>
                                <Input 
                                    {...register('confirm_password')}
                                    type="password"
                                    id="confirmpassword"
                                    className="mt-1 border border-gray-300 focus:ring focus:ring-blue-300 focus:border-blue-500 rounded-md p-2" 
                                />
                                {errors.confirm_password && <div className="text-red-500 mt-2">{errors.confirm_password.message}</div>}
                                {errors.root && <div className="text-red-500 mt-2">{errors.root.message}</div>}
                            </div>

                            <Button className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md" disabled={isPending || isSubmitting}>
                                {isPending || isSubmitting ? "Submitting..." : "Reset Password"}
                            </Button>
                        </form>

                        <Link href="/auth/login" className='mt-4 text-blue-600 hover:underline'>Back to Login</Link>
                    </Card>
                </div>
            </div>
        </Suspense>
    );
}

export default NewPassword;
