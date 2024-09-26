import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import {auth} from '@/app/helpers/auth'
import { Button } from '@/components/ui/button'
import { CloudUpload } from 'lucide-react';
import Link from 'next/link'
import {Separator} from '@/components/ui/separator'


const page = async () => {

  return (
    <>
      <div className='py-6 px-6 md:px-14 min-h-screen bg-[#FAFAFA]'>

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
                  <Input type='text' id='firstname' value={''} className='mt-1'/> 
                </div>

                <div className='w-full'>
                  <Label htmlFor='lastname'>Last Name</Label>
                  <Input type='text' id='lastname' value={''} className='mt-1'/>
                </div>

              </div>

              <div className='mt-5'>
                <Label htmlFor='email'>Email</Label>
                <Input type='email' id='email' placeholder='' className='mt-1'/>
              </div>

              <div className='flex gap-5 mt-5'>

                <div className='w-full'>
                  <Label htmlFor='username'>Username</Label>
                  <Input type='text' id='username' value={''} placeholder='' className='mt-1'/>
                </div>

                <div className='w-full'>
                  <Label>Phone Number</Label>
                  <Input type='text' id='' value={''} placeholder='' className='mt-1'/>
                </div>

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
                <h1 className='font-bold text-lg'>Joshua Uwakwe</h1>
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
                <span className='py-3 px-5 bg-[#EBF9E6] text-[#18B304] rounded-[20px]'>Connected</span>
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
            <Button size={'lg'}>Save</Button>
       
        </div>

      </div>
    </>
  )
}

export default page