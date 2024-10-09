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

                if(data.success) {
                    window.location.href = '/auth/login'
                }
                setSuccess(data.success)
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
            <div className="relative flex items-end bg-gray-900 lg:col-span-6 lg:h-full">
                <img
                    alt=""
                    src="https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=3008&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
            </div>

            <div className="lg:col-span-6 flex justify-center items-center">
                <Card className="p-8 bg-white rounded-[16px] min-w-[430px] flex flex-col items-center gap-3 shadow-md border-none">
                    <h1 className="text-2xl font-bold">Verify Email</h1>
                    <p>to continue with our Expense Tracker</p>

                    {!success && !error && <PuffLoader />}

                    {success && (
                        <div className="bg-[#33ec5b] text-white p-2 rounded-md">
                            {success}
                        </div>
                    )}

                    {!success && error && (
                        <div className="bg-[#a12424] text-white p-2 rounded-md">
                            {error}
                        </div>
                    )}

                    <Link href="/auth/login" className="">
                        Back to Login
                    </Link>
                </Card>
            </div>
        </div>
    )
}

export default Page
