import { Category, CategoryResponse, Expense, ExpenseResponse } from "@/app/types";
import axios, {AxiosResponse} from "axios";
import prisma from "@/prisma";

// API REQUEST TO GET LOGGED IN USER EXPENSE AND CATEGORY
export async function getUserExpense(userId: string): Promise<AxiosResponse<ExpenseResponse>> {
  try {
    const response = await axios.get<ExpenseResponse>(`/api/v1/expense/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching user expenses:', error);
    throw error;
  }
}

export async function getUserCategories(userId: string): Promise<AxiosResponse<CategoryResponse>> {
  try {
    const response = await axios.get<CategoryResponse>(`/api/v1/category/${userId}`);
    return response; // Return the full response object
  } catch (error) {
    console.error('Error fetching user categories:', error);
    throw error;
  }
}

// API POST METHOD TO SEND LOGGED IN USER DATA TO MONGODB
export async function addCategory(name: string, userId: string): Promise<AxiosResponse<CategoryResponse>> {
    try {
        const response = await axios.post<CategoryResponse>('/api/v1/category', {
            name,
            userId
        });
        return response
    } catch (error) {
        throw error;
    }
}

export async function addExpense(amount: number, description: string, categoryname: string, userId: string, date: string): Promise<AxiosResponse<ExpenseResponse>> {
    try {
        const response = await axios.post<ExpenseResponse>('/api/v1/expense', {
            amount,
            description,
            categoryname,
            userId,
            date
        });
        return response
    } catch (error) {
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