"use client"

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Expense, CategoryResponse } from "@/app/types";
import  { getUserCategories, getUserExpense, addCategory as apiAddCategory, addExpense as apiAddExpense } from "@/lib/ApiRequests/requests";
import {useTransition} from 'react'
import { toast } from "@/hooks/use-toast";

interface ContextType {
    session: Session | null;
    expenseData: Expense[];
    categories: Category[];
    error: string | null;
    userId: string | undefined;
    getTotalExpense: () => number; 
    addCategory: (name: string, userId: string) => Promise<void>;
    addExpense: (amount: number, description: string, categoryname: string, userId: string, date: string) => Promise<void>;
    isExpenseLoading: boolean;
    isCategoryLoading: boolean;
    isExpensePending: boolean;
    isCategoryPending: boolean;
}

const AppContext = createContext<ContextType | undefined>(undefined);

export function ContextWrapper({ children }: { children: React.ReactNode }) {
    // User data
    const { data: session } = useSession();

    // Expense data
    const [expenseData, setExpenseData] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isExpensePending, setIsExpenseTransition] =useTransition()
    const [isCategoryPending, setIsCategoryTransition] = useTransition()
    const [isExpenseLoading, setIsExpenseLoading] = useState<boolean>(false)
    const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false)

    const userId = session?.user?.id;

    const fetchExpenseData = async () => {
        try {
            if (userId) {
               const response = await getUserExpense(userId);
               setExpenseData(response.data.expense)
               if (response.status === 200) {
                toast({
                    variant: 'default',
                    title: 'Success',
                    description: 'User Expense Data Has Been Fetched Successfully'
                })
               }
            }
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description:  (err as Error).message ? `${(err as Error).message} (Expense fetch failed)` : 'An error occurred fetching expense'
            })
        }
    };

    const fetchCategories = async () => {
        try {
            if (userId) {
               const response = await getUserCategories(userId);
               setCategories(response.data.category)
               if(response.status === 200) {
                toast({
                    variant: 'default',
                    title: 'Success',
                    description: 'User Category Data Has Been Fetched Successfully'
                })
               }
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description:  (error as Error).message ? `${(error as Error).message} (Categories fetch failed)` : 'An error occurred fetching categories'
            })
        }
    };

    useEffect(() => {
        if (userId) {
            fetchExpenseData();
            fetchCategories();
        }
    }, [userId]);

    const getTotalExpense = () => {
        return expenseData.reduce((total, item) => total + item.amount, 0);
    };

    const addExpense = async (amount: number, description: string, categoryname: string, userId: string, date: string): Promise<void> => { // Ensure return type is Promise<void>
        setIsExpenseLoading(true)
        try {
            const response = await apiAddExpense(amount, description, categoryname, userId, date)
            
            if(response.status === 201) {
                const expense = response?.data?.expense
                if(expense) {
                    setExpenseData((prev) => [...prev, expense as unknown as Expense])
                }
                toast({
                    variant: 'default',
                    description: response ? response?.data?.message : 'Successfully Added Expense',
                    title: "Success"
                })
            }

            setIsExpenseTransition(() => {
                fetchExpenseData()
            })

        } catch (error) {
            toast({
                title: 'Error',
                description: `${(error as { response?: { data?: { message?: string } } })?.response?.data?.message}`,
                variant: 'destructive'
            })
        } finally {
            setIsExpenseLoading(false)
        }
    };

    const addCategory = async (name: string, userId: string) => {
        setIsCategoryLoading(true)
        try {
            const response = await apiAddCategory(name, userId); // Call the API with both parameters

            if(response.status === 201) {
                const newCategory = response?.data?.category;
                if (newCategory) {
                    setCategories((prev) => [...prev, newCategory as unknown as Category]) // Cast to unknown first
                }
                toast({
                    title: "Success",
                    description: response ? response?.data?.message : 'Successfull Added Category',
                    variant: 'default'
                })
            }

            setIsCategoryTransition(() => {
                fetchCategories()
            })
           
        } catch (error) {
            toast({
                title: 'Error',
                description: `${(error as { response?: { data?: { message?: string } } })?.response?.data?.message}`,
            })
        } finally {
            setIsCategoryLoading(false)
        }
    };

    return (
        <AppContext.Provider value={{ session, expenseData, categories, isExpenseLoading, isCategoryLoading, error, userId, isExpensePending, isCategoryPending, addCategory, addExpense, getTotalExpense }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within a ContextWrapper");
    }
    return context;
}
