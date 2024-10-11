'use client'

import { Card } from '@/components/ui/card'
import React, { useCallback, useEffect, useState } from 'react'
import { PuffLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'
import { tokenVerification } from '@/app/actions/tokenVerification'
import { toast } from '@/hooks/use-toast'
import Link from 'next/link'

const Page = () => {
    const params = useSearchParams()
    const token = params.get("token")

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const onSubmit = useCallback(() => {
        if (success || error) return

        if (!token) {
            setError("Missing Token")
            return
        }

        tokenVerification(token)
            .then((data) => {
                if (data.success) {
                    setSuccess(data.success)
                    window.location.href = '/auth/login'
                }
                setError(data.error)
                toast({
                    variant: data.error ? "destructive" : "default",
                    title: data.success ? "Success" : "Error",
                    description: data.success || data.error
                })
            })
            .catch((err) => {
                console.error(err)
                setError("Something went wrong!")
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: err
                })
            })
    }, [token, error, success])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <div className="grid lg:grid-cols-12 min-h-screen text-[14px]">
            <div className="relative hidden md:flex items-end bg-gray-900 lg:col-span-6 lg:h-full">
                <img
                    alt=""
                    src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=3008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
            </div>

            <div className="lg:col-span-6 flex justify-center items-center">
                <Card className="p-8 bg-white shadow-lg rounded-xl min-w-[430px] flex flex-col items-center gap-3">
                    <h1 className="text-2xl font-semibold text-gray-800">Verify Email</h1>
                    <p className="text-gray-600">to continue with our Expense Tracker</p>

                    {!success && !error && <PuffLoader />}

                    {success && (
                        <div className="bg-green-500 text-white p-2 rounded-md w-full text-center">
                            {success}
                        </div>
                    )}

                    {!success && error && (
                        <div className="bg-red-500 text-white p-2 rounded-md w-full text-center">
                            {error}
                        </div>
                    )}

                    <Link href="/auth/login" className="mt-4 text-blue-600 hover:underline">Back to Login</Link>
                </Card>
            </div>
        </div>
    )
}

export default Page;
