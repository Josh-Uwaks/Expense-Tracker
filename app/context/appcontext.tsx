import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Expense } from "@/app/types";
import  { getUserCategories, getUserExpense } from "@/lib/ApiRequests/requests";

interface ContextType {
    session: Session | null;
    expense: Expense[];
    categories: Category[];
    error: string | null;
    userId: string | undefined;
    refreshExpenses: () => void;
    refreshCategories: () => void;
    getTotalExpense: () => number; // Ensure this is correctly defined
}

const AppContext = createContext<ContextType | undefined>(undefined);

export function ContextWrapper({ children }: { children: React.ReactNode }) {
    // User data
    const { data: session } = useSession();

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

    useEffect(() => {
        if (userId) {
            fetchExpenses();
            fetchCategories();
        }
    }, [userId]);

    return (
        <AppContext.Provider value={{ session, expense, categories, error, userId, refreshCategories: fetchCategories, refreshExpenses: fetchExpenses, getTotalExpense }}>
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
