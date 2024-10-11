"use client";

import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginSchema, LoginInput } from "@/app/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginAction } from "@/app/actions/login";
import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { defaultLoginRedirect } from "@/route";
import { Card } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use by a different provider"
      : "";
  const callbackUrl = searchParams.get("callbackUrl");

  const [show2FA, setShow2FA] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    startTransition(async () => {
      LoginAction(data)
        .then((data) => {
          if (data.error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: data.error || data.details || "An unexpected error occurred",
            });
          }

          // Handle successful login without 2FA
          if (data.success && !data.twoFactor) {
            reset();
            window.location.href = callbackUrl || defaultLoginRedirect; // Redirect to secured route
          }

          if (data.twoFactor) {
            toast({
              variant: "default",
              title: "2FA Authentication",
            });
            setShow2FA(true);
          }

          if (data.message) {
            reset();
            toast({
              variant: "default",
              title: `${data.message}`,
              description:
                data.message === "Confirmation Email has been sent"
                  ? "Your Account has not been verified, kindly check your mail box and click on the verification link."
                  : data.message,
            });
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Something went wrong.",
            description: error,
          });
        });
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
          <p className="text-gray-600">to continue with our Expense Tracker</p>

          <form className="my-6" onSubmit={handleSubmit(onSubmit)}>
            {show2FA && (
              <>
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Input
                    {...register("code")}
                    type="text"
                    id="code"
                    className="mt-1"
                    placeholder="2FA Code"
                  />
                </div>
                {errors.code && <div className="text-red-500 mt-1">{errors.code.message}</div>}
              </>
            )}

            {!show2FA && (
              <>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    type="email"
                    id="email"
                    className="mt-1"
                  />
                </div>
                {errors.email && <div className="text-red-500 mt-3">{errors.email.message}</div>}

                <div className="my-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")}
                    type="password"
                    id="password"
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-end">
                  <Link href={"/auth/reset"} className="text-blue-600 hover:underline">
                    forgot password?
                  </Link>
                </div>

                {errors.password && <div className="text-red-500">{errors.password.message}</div>}
                {urlError && <div className="text-red-500">{urlError}</div>}
              </>
            )}

            <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-teal-400 text-white hover:scale-105 transition-transform" disabled={isPending || isSubmitting} onClick={(e) => {
                if (isPending || isSubmitting) {
                  e.preventDefault(); // Prevent action if already submitting
                }
              }}>
                 {show2FA ? "Confirm" : isPending || isSubmitting ? "Submitting..." : "Submit"}
            </Button>

           
          </form>

          {!show2FA && (
            <>
              <div className="relative mt-12 pb-12 border-t border-input">
                <div className="bg-white absolute left-1/2 -mt-[26px] transform -translate-x-1/2 p-4 rounded-full">
                  or
                </div>
              </div>

              <div
                className="flex gap-2 p-3 rounded-md border border-input cursor-pointer hover:bg-gray-100 transition duration-200"
                onClick={() => signIn("google", { callbackUrl: defaultLoginRedirect })}
              >
                <FcGoogle size={20} />
                <p>Continue with Google</p>
              </div>
            </>
          )}

          <div className="mt-4 text-gray-600">
            No account?{" "}
            <Link href={"/auth/register"} className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
