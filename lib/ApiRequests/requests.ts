import { Category, CategoryResponse, Expense, ExpenseResponse } from "@/app/types";
import axios from "axios";
import prisma from "@/prisma";

// API REQUEST TO GET LOGGED IN USER EXPENSE AND CATEGORY
export async function getUserExpense(userId: string): Promise<ExpenseResponse> {
  try {
    const response = await axios.get<ExpenseResponse>(`/api/v1/expense/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user expenses:', error);
    throw error;
  }
}

export async function getUserCategories(userId: string): Promise<CategoryResponse> {
  try {
    const response = await axios.get<CategoryResponse>(`/api/v1/category/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user categories:', error);
    throw error;
  }
}

// API POST METHOD TO SEND LOGGED IN USER DATA TO MONGODB
export async function addCategory(name: string, userId: string) {
    try {
        const response = await axios.post('/api/v1/category', {
            name,
            userId
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting category:", error);
        throw error;
    }
}

export async function submitExpense(amount: number, description: string, category: string, userId: string, date: string) {
    try {
        const response = await axios.post('/api/v1/expense', {
            amount,
            description,
            category,
            userId,
            date
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting expense:", error);
        throw error;
    }
}


//API REQUEST TO UPDATE LOGGED IN USER DATA
export const updateExpense = async (id: string, updatedData: Partial<Expense>) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update expense');
      }
  
      const result = await response.json();
      return result
    } catch (error) {
      return error
    }
  };


  export const getUserByEmail = async (email: string) => {
    try {

      const user = await prisma.user.findUnique({
        where: {
          email: email
        }
      })

      return user
      
    } catch {
      return null
    }

  }

  export const getUserById = async (id: any) => {
    try {
      const userId = await prisma.user.findUnique({
        where: {
          id: id
        }
      })

      return userId
    } catch {
      return null
    }
  }