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
import { Separator } from '@/components/ui/separator'
import DatePicker from "./datepicker"
import SelectCategory from "./selectCategory"
import SignedUserClient from "@/hooks/signedUserClient"
import { useAppContext } from "@/app/context/appcontext"
import { toast } from "@/hooks/use-toast"

const CreateExpense = () => {
    const { user } = SignedUserClient()
    const { categories, addCategory, addExpense, isCategoryLoading, isExpenseLoading, isCategoryPending, isExpensePending } = useAppContext()

    const [category, setCategory] = useState<string>('')
    const [filteredCategories, setFilteredCategories] = useState<string[]>([])
    const [expenseData, setExpenseData] = useState({
        amount: '',
        description: '',
        category: '',
        date: ''
    })

    const AddCategory = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()

        if (user?.id && category) {
            await addCategory(category, user?.id)
            setCategory("")
        }
    }

    const AddExpense = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()

        if (!expenseData.amount || !expenseData.category || !expenseData.description) {
            toast({
                variant: 'default',
                title: "Please fill in all required fields"
            });
            return;
        }

        if (user?.id && expenseData) {
            await addExpense(Number(expenseData.amount), expenseData.description, expenseData.category, user?.id, expenseData.date)
            clearForm()
        }
    }

    const clearForm = () => {
        setExpenseData({
            amount: '',
            description: '',
            category: '',
            date: ''
        })
        setCategory("");
        setFilteredCategories([]); 
    }

    const handleFormData = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
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

    const handleCategoryInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setCategory(value);

        
        const filtered = categories
            .filter(cat => cat.name.toLowerCase().includes(value.toLowerCase()))
            .map(cat => cat.name); 

        setFilteredCategories(filtered);
    };

    const selectSuggestion = (suggestion: string) => {
        setCategory(suggestion);
        setFilteredCategories([]); 
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center bg-blue-600 text-white hover:bg-blue-500 transition duration-300">
                    <Plus size={20} />
                    <span className="hidden md:block">New Expense</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="min-w-[70%] bg-white rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800 text-left">Create New Expense</DialogTitle>
                    <DialogDescription className="text-gray-600 text-left">
                        Please provide the necessary information to add to the expense data.
                    </DialogDescription>
                </DialogHeader>
                <Separator className="md:mt-4 md:mb-8" />

                <div className="mt-3 lg:grid grid-cols-2 gap-5">
                    <div>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Label htmlFor="amount" className="lg:w-[100px] text-left">Amount*</Label>
                            <Input type="number" id="amount" placeholder="Enter Amount" className="mt-3 md:mt-0 lg:w-[500px] border-gray-300 focus:border-blue-500 focus:ring-blue-500" name="amount" value={expenseData.amount} onChange={handleFormData} />
                        </div>
                        <div className="my-4 flex flex-col md:flex-row md:items-center">
                            <Label className="lg:w-[100px] text-left mb-2 md:mb-0">Date*</Label>
                            <DatePicker classname="w-full lg:w-[500px] md:mt-0" selectedDate={expenseData.date ? new Date(expenseData.date) : undefined}
                                onDateChange={handleDateChange} />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Label className="lg:w-[100px] text-left mb-2">Category*</Label>
                            <SelectCategory
                                classname='w-full lg:w-[500px] mt-2 md:mt-0'
                                name="category"
                                value={expenseData.category}
                                category={categories.map((item) => ({ label: item.name, value: item.id }))}
                                onChange={(value) => setExpenseData({ ...expenseData, category: value })}
                            />
                        </div>
                        <div className="my-4 flex flex-col md:flex-row md:items-center">
                            <Label htmlFor="description" className="lg:w-[100px] mb-2 text-left">Description*</Label>
                            <Textarea placeholder="Description here..." className="mt-1 md:mt-0 resize-none w-full lg:w-[500px] h-[200px] border-gray-300 focus:border-blue-500 focus:ring-blue-500" name="description" value={expenseData.description} onChange={handleFormData} />
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <Label className="lg:w-[100px]">Categories</Label>
                            <Input
                                className="mt-1 md:mt-0 lg:w-[500px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                value={category}
                                onChange={handleCategoryInputChange}
                                name="addCat"
                            />
                            <Button onClick={AddCategory} disabled={isCategoryPending || isCategoryLoading || !category} className={`${!category ? 'bg-blue-200' : 'bg-blue-600'} text-white hover:bg-blue-400 transition duration-300`}>
                                {isCategoryLoading || isCategoryPending ? "Adding..." : "Add"}
                            </Button>
                        </div>
                        {/* Suggestions Dropdown */}
                        <div className="ml-[90px] mt-2">
                        {filteredCategories.length > 0 && (
                            <div className=" bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-20 transition-opacity duration-150 ease-in-out opacity-100">
                                {filteredCategories.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className=" p-2 hover:bg-blue-100 focus:bg-blue-200 transition-colors duration-200 cursor-pointer rounded-md capitalize text-[14px]"
                                        onClick={() => selectSuggestion(suggestion)}
                                        tabIndex={0} // Makes it focusable for accessibility
                                        onKeyDown={(e) => e.key === 'Enter' && selectSuggestion(suggestion)} // Allows selection via keyboard
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                        </div>

                    </div>
                </div>

                <div className="mt-3">
                    <div className="flex gap-4 justify-end">
                        <Button className="mb-2 bg-blue-600 text-white hover:bg-blue-500 transition duration-300" onClick={AddExpense} disabled={isExpenseLoading || isExpensePending}>
                            {isExpenseLoading || isExpensePending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-300" variant={'ghost'} onClick={clearForm}>Clear</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateExpense
