import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Expense } from "@/app/types";
import  { getUserCategories, getUserExpense, addCategory as apiAddCategory } from "@/lib/ApiRequests/requests";

interface ContextType {
    session: Session | null;
    expense: Expense[];
    categories: Category[];
    error: string | null;
    userId: string | undefined;
    refreshExpenses: () => void;
    refreshCategories: () => void;
    getTotalExpense: () => number; // Ensure this is correctly defined
    addCategory: (name: string, userId: string) => Promise<void>
}

const AppContext = createContext<ContextType | undefined>(undefined);

export function ContextWrapper({ children }: { children: React.ReactNode }) {
    // User data
    const { data: session } = useSession();
    console.log(session)

    // Expense data
    const [expense, setExpenses] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const userId = session?.user?.id;

    const fetchExpenses = async () => {
        try {
            if (userId) {
                const data = await getUserExpense(userId);
                setExpenses(data.getExpenseId);
            }
        } catch (err) {
            setError((err as Error).message || 'An error occurred');
        }
    };

    const fetchCategories = async () => {
        try {
            if (userId) {
                const data = await getUserCategories(userId);
                setCategories(data.getCategoryById);
            }
        } catch (error) {
            setError((error as Error).message || 'An error occurred');
        }
    };

    const getTotalExpense = () => {
        return expense.reduce((total, item) => total + item.amount, 0);
    };

    const addCategory = async (name: string, userId: string) => {
        try {
            const response = await apiAddCategory(name, userId); // Call the API with both parameters
            if (response.status === 201) {
                const newCategory = response?.data?.newCategory; // Adjust this according to your response structure
                setCategories((prev) => [...prev, newCategory]); // Add the new category to the state
            } else {
                setError(response?.data?.message); // Set error message from the response
            }
        } catch (error) {
            setError((error as Error).message || 'An error occurred while adding the category.');
        }
    };
    

    useEffect(() => {
        if (userId) {
            fetchExpenses();
            fetchCategories();
        }
    }, [userId]);

    return (
        <AppContext.Provider value={{ session, expense, categories, error, userId, addCategory, refreshCategories: fetchCategories, refreshExpenses: fetchExpenses, getTotalExpense }}>
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
