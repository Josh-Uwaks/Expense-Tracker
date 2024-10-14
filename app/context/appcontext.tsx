"use client"

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Expense, ExpenseUpdateInput } from "@/app/types";
import  { getUserCategories, getUserExpense, addCategory as apiAddCategory, addExpense as apiAddExpense, updateExpense, deleteExpense } from "@/lib/ApiRequests/requests";
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
    handleUpdate: (amount: number, description: string, userId: string, categoryId: string,  date: string) => Promise<void>;
    handleDelete: () => Promise<void>;
    isExpenseLoading: boolean;
    isCategoryLoading: boolean;
    isExpensePending: boolean;
    isCategoryPending: boolean;
    saving: boolean;
    deleting: boolean;
    expenseId: string | null;
    setExpenseId: React.Dispatch<React.SetStateAction<string | null>>;
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
    const [expenseId, setExpenseId] = React.useState<string | null>(null);
    const [saving, setSaving] = React.useState<boolean>(false)
    const [deleting, setDeleting] = React.useState<boolean>(false)

    const userId = session?.user?.id;

    const fetchExpenseData = async () => {
        try {
            if (userId) {
               const response = await getUserExpense(userId);
               setExpenseData(response.data.expenses)
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
                const expense = response?.data?.expenses
                console.log({
                    "expense after successful 201": expense
                })
                if (Array.isArray(expense) && expense.length > 0) {
                    setExpenseData((prev) => [...prev, ...expense]); // Spread the new expenses
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
                console.log({
                    "category after successful 201": newCategory
                })
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

    const handleUpdate = async (amount: number, description: string, userId: string, categoryId: string,  date: string) => {
   
        try {
            setSaving(true)
          if (expenseId) {
            const updateData: ExpenseUpdateInput = {
              amount,
              description,
              userId,
              categoryId,
              date: date ? new Date(date).toISOString() : new Date().toISOString()
            };

            const response = await updateExpense(expenseId, updateData);

            setSaving(false)

            if(response.message === "Expense updated successfully"){
              toast({
              variant: 'default',
              title: 'SUCCESS',
              description: `Expense updated successfully - ID: ${expenseId}`
            });
            }

            setIsExpenseTransition(() => {
                fetchExpenseData()
            })

          }
        } catch (error: any) {
          console.log(error)
          setSaving(false)
          toast({
            variant: 'destructive',
            title: 'ERROR',
            description: `Failed to update expense: ${error.message || 'Unknown error'}`
          });
          console.error('Error in handleUpdate:', error);
        }
      };

      const handleDelete = async () => {
        setDeleting(true);
        try {
          if (expenseId) {
            await deleteExpense(expenseId);
            
               toast({
              variant: 'default',
              title: 'SUCCESS',
              description: `Expense deleted successfully - ID: ${expenseId}`,
            });

            setDeleting(false)
        
            setIsExpenseTransition(() => {
                fetchExpenseData()
            })
           
          }
        } catch (error: any) {
          console.log(error);
          toast({
            variant: 'destructive',
            title: 'ERROR',
            description: `Failed to delete expense: ${error.message || 'Unknown error'}`,
          });
        } finally {
          setDeleting(false);
        }
      };

    return (
        <AppContext.Provider value={{ session, expenseData, categories, isExpenseLoading, isCategoryLoading, error, userId, isExpensePending, isCategoryPending, saving, deleting, expenseId, addCategory, addExpense, getTotalExpense, handleUpdate, handleDelete, setExpenseId }}>
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
