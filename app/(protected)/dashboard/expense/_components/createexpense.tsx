"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import React, { ChangeEvent, useState } from "react"
import { Plus } from 'lucide-react';
import {Separator} from '@/components/ui/separator'
import DatePicker from "./datepicker"
import SelectCategory from "./selectCategory"
import SignedUserClient from "@/hooks/signedUserClient"
import { toast } from "@/hooks/use-toast"
import { useAppContext } from "@/app/context/appcontext"


const CreateExpense = () => {

    const user = SignedUserClient()
    const {categories, addCategory, addExpense, isCategoryLoading, isExpenseLoading, isCategoryPending, isExpensePending} = useAppContext()
 
    const [category, setCategory] = useState<string>('')
    const [expenseData, setExpenseData] = useState({
        amount: '',
        description: '',
        category: '',
        date: ''
    })

    const AddCategory = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()

        if(user?.id && category) {
            await addCategory(category, user?.id)
            setCategory("")
        }

    }

    const AddExpense = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
       
        if(user?.id && expenseData) {
            await addExpense(Number(expenseData.amount), expenseData.description, expenseData.category, user?.id, expenseData.date)
            setExpenseData({
                amount: '',
                description: '',
                category: '',
                date: ''
            })
        }
    }

    const handleFormData = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target

        setExpenseData({
            ...expenseData,
            [name]: value
        })
    }

    const handleDateChange = (selectedDate: Date | undefined) => {
        setExpenseData({
            ...expenseData,
            date: selectedDate ? selectedDate.toISOString() : '',
        });
    };


    return (
        <>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center">
                    <Plus size={20}/>
                    <span className='hidden md:block'>New Expense</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="min-w-[70%]">
              <DialogHeader>
                <DialogTitle>Create New Expense</DialogTitle>
                <DialogDescription>
                  This provide the necessary informations to create add to the expense data.

                  <Separator className="mt-4 mb-8"/>

                  <div className="mt-3 lg:grid grid-cols-2 gap-5">

                    <div>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Label htmlFor="amount" className="lg:w-[100px] text-left">Amount*</Label>
                            <Input type="text" id="amount" placeholder="enter amount" className="mt-1 md:mt-0 lg:w-[500px]" name="amount" value={expenseData.amount} onChange={handleFormData}/>
                        </div>
                        <div className="my-4 flex flex-col md:flex-row md:items-center">
                            <Label className="lg:w-[100px] text-left">Date*</Label>
                            <DatePicker classname="w-full lg:w-[500px] mt-1 md:mt-0"   selectedDate={expenseData.date ? new Date(expenseData.date) : undefined} 
                    onDateChange={handleDateChange} />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Label className="lg:w-[100px] text-left">Category*</Label>
                            <SelectCategory 
                                classname='w-full lg:w-[500px] mt-1 md:mt-0'
                                name="category" 
                                value={expenseData.category} 
                                category={categories.map((item) => ({label: item.name, value: item.id}))}
                                onChange={(value) => setExpenseData({ ...expenseData, category: value })} 
                            />
                        </div>
                        <div className="my-4 flex flex-col md:flex-row md:items-center">
                            <Label htmlFor="description" className="lg:w-[100px] text-left">Description*</Label>
                            <Textarea placeholder="Description here..." className="mt-1 md:mt-0 resize-none w-full lg:w-[500px] h-[200px]" name="description" value={expenseData.description} onChange={handleFormData}/>
                        </div>
                    </div>
                    

                    <div>
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <Label className="lg:w-[100px]">Categories</Label>
                            <Input className="mt-1 md:mt-0 lg:w-[500px]" value={category} onChange={(e) => setCategory(e.target.value)} name="addCat"/>
                            <Button onClick={AddCategory} disabled={isCategoryPending || isCategoryLoading}>{isCategoryLoading || isCategoryPending ? "Adding..." : "Add"}</Button>
                        </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex gap-4 justify-end">
                        <Button className="mb-2" onClick={AddExpense} disabled={isExpenseLoading || isExpensePending}>{isExpenseLoading || isExpensePending ? 'Saving...' : 'Save'}</Button> 
                        <Button className="" variant={'ghost'}>Clear</Button>
                    </div>

                
                  </div>


                </DialogDescription>
              </DialogHeader>
            </DialogContent>
        </Dialog>
           
        </>
    )
}

export default CreateExpense
