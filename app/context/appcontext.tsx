"use client"

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Expense, CategoryResponse } from "@/app/types";
import  { getUserCategories, getUserExpense, addCategory as apiAddCategory, addExpense as apiAddExpense } from "@/lib/ApiRequests/requests";
import {useTransition} from 'react'

interface ContextType {
    session: Session | null;
    expenseData: Expense[];
    categories: Category[];
    error: string | null;
    userId: string | undefined;
    getTotalExpense: () => number; 
    addCategory: (name: string, userId: string) => Promise<void>
    addExpense: (amount: number, description: string, categoryname: string, userId: string, date: string) => Promise<void>
    isPending: boolean;
    isLoading: boolean
}

const AppContext = createContext<ContextType | undefined>(undefined);

export function ContextWrapper({ children }: { children: React.ReactNode }) {
    // User data
    const { data: session } = useSession();

    // Expense data
    const [expenseData, setExpenseData] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const userId = session?.user?.id;

    const fetchExpenseData = async () => {
        try {
            if (userId) {
               const response = await getUserExpense(userId);
               setExpenseData(response.expense)
            }
        } catch (err) {
            setError((err as Error).message || 'An error occurred');
        }
    };

    const fetchCategories = async () => {
        try {
            if (userId) {
               const response = await getUserCategories(userId);
               setCategories(response.category)
            }
        } catch (error) {
            setError((error as Error).message || 'An error occurred');
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
        setIsLoading(true)
        try {
            const response = await apiAddExpense(amount, description, categoryname, userId, date)
            if(response.status === 201) {
                const expense = response?.data?.expense
                setExpenseData((prev) => [...prev, expense])
            }

            startTransition(() => {
                fetchExpenseData()
            })
        } catch (error) {
            console.log(error)
            setError((error as Error).message || 'An error occurred while adding the expense.');
        } finally {
            setIsLoading(false)
        }
    };

    const addCategory = async (name: string, userId: string) => {
        setIsLoading(true)
        try {
            const response = await apiAddCategory(name, userId); // Call the API with both parameters

            if(response.status === 201) {
                const newCategory = response?.data?.newCategory;
                setCategories((prev) => [...prev, newCategory])
            }

            startTransition(() => {
                fetchCategories()
            })
           
        } catch (error) {
            console.log(error)
            setError((error as Error).message || 'An error occurred while adding the category.');
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <AppContext.Provider value={{ session, expenseData, categories, isLoading, error, userId, isPending, addCategory, addExpense, getTotalExpense }}>
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
