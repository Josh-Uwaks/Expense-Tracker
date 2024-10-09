"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Button } from '@/components/ui/button'
import { CloudUpload } from 'lucide-react';
import Link from 'next/link'
import {Separator} from '@/components/ui/separator'
import SignedUserClient from '@/hooks/signedUserClient'
import { useTransition } from 'react'
import {useForm, SubmitHandler} from 'react-hook-form'
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
import {useState} from 'react'

const page = () => {


  const [isPending, startTransition] = useTransition()
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false)
  const user = SignedUserClient()

  const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SettingsInput>({
    resolver: zodResolver(SettingsSchema)
    // defaultValues: {
    //   name: user?.name || undefined,
    //   email: user?.email || undefined,
    //   mobilenumber: user?.mobilenumber || undefined,
    //   role: user?.role || undefined,
    //   password: undefined,
    //   new_password: undefined,
    //   isTwofactorEnabled: user?.isTwofactorEnabled // problem at the moment
    // }
  })

  console.log({
    "errors are as follows": errors
  })
  const onSubmit: SubmitHandler<SettingsInput> = async (data) => {
    console.log({
      "onSubmit data": {
        data
      }
    });
  
    // startTransition(() => {
    //   SettingsAction({
    //     name: data.name,
    //     email: data.email,
    //     mobilenumber: data.mobilenumber,
    //     role: data.role,
    //     password: data.password,
    //     new_password: data.new_password,
    //     isTwofactorEnabled: data.isTwofactorEnabled
    //   })
    //   .then((data) => {
    //     if (data.error) {
    //       toast({
    //         variant: "destructive",
    //         title: "Error",
    //         description: data.error || "An unexpected error occurred", // Ensure error is a string here
    //       });
    //     }
  
    //     if (data.success) {
    //       // session.update()
    //       // .catch((err) => {
    //       //   console.error("Session update error:", err); // Log session error
    //       //   toast({
    //       //     variant: 'destructive',
    //       //     title: 'Error',
    //       //     description: err.message || "Failed to update session"
    //       //   });
    //       // });
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("SettingsAction Error:", error); // Log full error object for debugging
    //     toast({
    //       variant: 'destructive',
    //       title: 'Error',
    //       description: error.message || "An unexpected error occurred" // Display a string message
    //     });
    //   });
    // });
  };
  
    // Handler to set the value of 2FA when the switch is toggled
    const handleTwoFactorToggle = (checked: boolean) => {
      setIsTwoFactorEnabled(checked)
    }

  return (
    <>
      <form className='py-6 px-6 md:px-14 min-h-screen bg-[#FAFAFA]' onSubmit={handleSubmit(onSubmit)}>

        <div className='mb-5'>
          <h1 className='text-2xl font-bold'>Owner Account</h1>
          <p className='text-gray-500'>Update your informations here</p>
        </div>

        <div className='2xl:grid grid-cols-3 gap-10'>

          <div className='col-start-1 col-end-3 border rounded-md p-6 bg-white'>
            <h1 className='text-lg font-bold'>Personal Informations</h1>
            
            <Separator className='mt-4'/>

            <div className='mt-6'>

              <div className='flex gap-5'>
                <div className='w-full'>
                  <Label htmlFor='firstname'>First Name</Label>
                  <Input type='text' id='firstname' {...register('name')} className='mt-1'/> 
                </div>

                <div className='w-full'>
                  <Label htmlFor='lastname'>Last Name</Label>
                  <Input type='text' id='lastname' className='mt-1'/>
                </div>

              </div>

              {user?.isOAuth == false && (
                <>
                  <div className='mt-5'>
                    <Label htmlFor='email'>Email</Label>
                    <Input type='email' id='email' placeholder='' {...register('email')} className='mt-1'/>
                  </div>
                </>
              )}

              <div className='flex gap-5 mt-5'>

                <div className='w-full'>
                  <Label htmlFor='username'>Username</Label>
                  <Input type='text' id='username' placeholder='' className='mt-1'/>
                </div>

                <div className='w-full'>
                  <Label>Phone Number</Label>
                  <Input type='text' id='' placeholder='' {...register('mobilenumber')} className='mt-1'/>
                </div>

              </div>

              {user?.isOAuth == false && (
                <>
                <div className='flex gap-5 mt-5'>
                  <div className='w-full'>
                    <Label htmlFor='password'>Old Password</Label>
                    <Input type='password' id='password' placeholder='' {...register('password')} className='mt-1'/>
                  </div>
                  <div className='w-full'>
                    <Label htmlFor='newpassword'>New Password</Label>
                    <Input type='password' id='newpassword' placeholder='' {...register('new_password')} className='mt-1'/>
                  </div>
              </div>
                </>
              )}
              

              <div className='mt-5'>
                <Label htmlFor='role'>Role</Label>
                <Select 
                    {...register('role')} 
                    onValueChange={(value) => {
                      // You can use the value directly here, no need to manually call onChange
                      console.log(value);
                      // Trigger the change in react-hook-form
                      register('role').onChange(
                        {target: {value}
                      });
                    }}
                  >
                    <SelectTrigger className='mt-1'>
                      <SelectValue placeholder='Select role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value='ADMIN'>ADMIN</SelectItem>
                        <SelectItem value='USER'>USER</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
              </div>

              <div className='flex justify-between p-4 items-center mt-7 rounded-md border'>
                <div>
                  <h1>Two Factor Authentication</h1>
                  <p>Toggle to control two factor authentication for your account</p>
                </div>
                {/* <Switch
                {...register('isTwofactorEnabled')}
                  checked={user?.isTwofactorEnabled}
                  onCheckedChange={handleTwoFactorToggle}
                /> */}
              </div>
              
              
            </div>
          </div>

          <div className='border rounded-md p-6 w-full bg-white mt-6 2xl:mt-0'>

            <h1 className='font-bold text-lg'>Your Photo</h1>

            <Separator className='mt-4'/>

            <div className='flex gap-3 mt-5'>
              <div className=' h-[50px] w-[50px] text-center rounded-full border'>
               P
              </div>

              <div className=''>
                <h1 className='font-bold text-lg'>{user?.name ? user.name : 'No Name'}</h1>
                <div className='flex gap-1'>
                  <button>Delete</button>
                  <button>Update</button>
                </div>
              </div>


            </div>

            <div className=' border-dashed border-[1px] border-[#e2e2e2] mt-6 rounded-md p-8 flex flex-col items-center'>
              <div className='h-[60px] rounded-full w-[60px] bg-[#e8e8e8] flex justify-center items-center'>
                <CloudUpload className='text-[#727272]'/>
              </div>

              <h1 className='mt-4 mb-2 text-gray-500'><span>click to upload</span> or drag and drop</h1>

              <div className='text-gray-500'>
                <p>SVG, PNG, JPG, or GIF</p>
                <p>(max. 800 x 400px)</p>
              </div>
            </div>

            <div className='border p-6 rounded-md mt-6'>
              <div className='flex items-center justify-between rounded-md'>
                <h1 className='text-2xl'>Google</h1>
                <span className={`py-3 px-5 ${user?.isOAuth ? 'text-[#18b304] bg-[#EBF9E6]' : 'text-white bg-red-600'} rounded-[20px]`}>{user?.isOAuth ? 'Connected' : 'Not Connected'}</span>
              </div>

              <div className='mt-5'>
                <p>Use Google to sign in your account.</p>
                <Link href={''}>Learn more</Link>
              </div>
            </div>

          </div>

        </div>

        <div className='flex gap-3 justify-end w-full mt-5'>
      
            <Button variant={'ghost'} size={'lg'}>Cancel</Button>
            <Button size={'lg'} disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</Button>
       
        </div>

      </form>
    </>
  )
}

export default page