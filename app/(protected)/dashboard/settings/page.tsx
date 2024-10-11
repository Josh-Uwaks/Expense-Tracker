"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Button } from '@/components/ui/button'
import { CloudUpload } from 'lucide-react';
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import SignedUserClient from '@/hooks/signedUserClient'
import { useTransition } from 'react'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { SettingsInput, SettingsSchema } from '@/app/schemas/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from '@/components/ui/switch'
import { FormControl, FormDescription, FormField, FormItem } from '@/components/ui/form'
import { SettingsAction } from '@/app/actions/settings'
import { toast } from '@/hooks/use-toast'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Page = () => {
  const [isPending, startTransition] = useTransition()
  const { user, update } = SignedUserClient()

  const methods = useForm<SettingsInput>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      username: user?.username || undefined,
      firstname: user?.firstname || undefined,
      lastname: user?.lastname || undefined,
      email: user?.email,
      mobilenumber: user?.mobilenumber || undefined,
      role: user?.role || undefined,
      password: undefined,
      new_password: undefined,
      isTwofactorEnabled: user?.isTwofactorEnabled
    }
  });

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = methods;

  const onSubmit: SubmitHandler<SettingsInput> = async (data) => {
    startTransition(() => {
      SettingsAction(data)
        .then((data) => {
          if (data.error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: data.error || "An unexpected error occurred",
            });
          }

          if (data.success) {
            toast({
              variant: 'default',
              title: 'Successfully updated settings',
              description: `${data.message}`
            })
            update()
              .catch((err) => {
                console.error("Session update error:", err);
                toast({
                  variant: 'destructive',
                  title: 'Error',
                  description: err.message || "Failed to update session"
                });
              });
          }
        })
        .catch((error) => {
          console.error("SettingsAction Error:", error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || "An unexpected error occurred"
          });
        });
    });
  };

  return (
    <FormProvider {...methods}>
      <form className='py-6 px-6 md:px-14 min-h-screen bg-[#FAFAFA]' onSubmit={handleSubmit(onSubmit)}>

        <div className='mb-5'>
          <h1 className='text-2xl font-bold text-[#333333]'>Owner Account</h1>
          <p className='text-[#727272]'>Update your information here</p>
        </div>

        <div className='2xl:grid grid-cols-3 gap-10'>
          <div className='col-start-1 col-end-3 border rounded-md p-6 bg-white shadow-md'>
            <h1 className='text-lg font-bold text-[#333333]'>Personal Information</h1>
            <Separator className='mt-4' />

            <div className='mt-6'>
              <div className='flex gap-5'>
                <div className='w-full'>
                  <Label htmlFor='firstname' className='text-[#333333]'>First Name</Label>
                  <Input type='text' id='firstname' {...register('firstname')} className='mt-1 border-[#e2e2e2]' />
                </div>

                <div className='w-full'>
                  <Label htmlFor='lastname' className='text-[#333333]'>Last Name</Label>
                  <Input type='text' id='lastname' {...register('lastname')} className='mt-1 border-[#e2e2e2]' />
                </div>
              </div>

              <div className='mt-5'>
                <Label htmlFor='email' className='text-[#333333]'>Email</Label>
                <Input type='email' id='email' {...register('email')} className='mt-1 border-[#e2e2e2]' disabled={user?.isOAuth} />
              </div>

              <div className='flex gap-5 mt-5'>
                <div className='w-full'>
                  <Label htmlFor='username' className='text-[#333333]'>Username</Label>
                  <Input type='text' id='username' {...register('username')} className='mt-1 border-[#e2e2e2]' />
                </div>

                <div className='w-full'>
                  <Label className='text-[#333333]'>Phone Number</Label>
                  <Input type='text' {...register('mobilenumber')} className='mt-1 border-[#e2e2e2]' />
                </div>
              </div>

              {user?.isOAuth === false && (
                <div className='flex gap-5 mt-5'>
                  <div className='w-full'>
                    <Label htmlFor='password' className='text-[#333333]'>Old Password</Label>
                    <Input type='password' id='password' {...register('password')} className='mt-1 border-[#e2e2e2]' autoComplete='off' />
                  </div>
                  <div className='w-full'>
                    <Label htmlFor='newpassword' className='text-[#333333]'>New Password</Label>
                    <Input type='password' id='newpassword' {...register('new_password')} className='mt-1 border-[#e2e2e2]' autoComplete='off' />
                  </div>
                </div>
              )}

              <div className='mt-5'>
                <Label htmlFor='role' className='text-[#333333]'>Role</Label>
                <FormField
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className='mt-1 border-[#e2e2e2]'>
                        <SelectValue placeholder='Select role' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='ADMIN'>ADMIN</SelectItem>
                          <SelectItem value='USER'>USER</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="isTwofactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-7">
                    <div className="space-y-0.5">
                      <h1 className="text-lg font-semibold text-[#333333]">Two Factor Authentication</h1>
                      <FormDescription>
                        Toggle to control two-factor authentication for your account.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={user?.isOAuth === true}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className='border rounded-md p-6 w-full bg-white mt-6 shadow-md 2xl:mt-0'>
            <h1 className='font-bold text-lg text-[#333333]'>Your Photo</h1>
            <Separator className='mt-4' />

            <div className='flex gap-3 mt-5'>
              <Avatar className='h-[50px] w-[50px]'>
                <AvatarImage src={user?.image || ""} alt='' className='rounded-full' />
                <AvatarFallback className='uppercase'>{user?.email.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <p className='text-[#727272]'>{user?.email}</p>
                <Link href='/upload' className='text-blue-600 hover:underline mt-1'>Change Photo</Link>
              </div>
            </div>

            {/* Google Account Connection Section */}
          <div className='col-span-full border rounded-md p-6 bg-white mt-6 shadow-md'>
            <h1 className='font-bold text-lg text-[#333333]'>Google Account</h1>
            <Separator className='mt-4' />

            <div className='mt-5'>
              {user?.isOAuth ? (
                <div className='flex justify-between items-center'>
                  <p className='text-green-600 font-semibold'>Connected</p>
                  <Link href='/api/auth/signout' className='text-blue-600 hover:underline'>Disconnect</Link>
                </div>
              ) : (
                <div className='flex justify-between items-center'>
                  <p className='text-red-600 font-semibold'>Not Connected</p>
                  <Link href='/api/auth/signin' className='text-blue-600 hover:underline'>Connect</Link>
                </div>
              )}
            </div>
            </div>
          </div>

          <div className='flex justify-end col-span-full mt-6'>
            <Button type='submit' className='bg-blue-600 hover:bg-blue-700 text-white' disabled={isSubmitting || isPending}>
              {isSubmitting || isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default Page;
