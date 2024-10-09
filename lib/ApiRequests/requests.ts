import { Category, CategoryResponse, Expense, ExpenseUpdateInput, ExpenseResponse } from "@/app/types";
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

export async function getSingleExpense(singleId: string): Promise<AxiosResponse<ExpenseResponse>> {
  try {
    const response = await axios.get<ExpenseResponse>(`/api/v1/expense/user_${singleId}`);
    return response;
  } catch (error) {
    console.error('Error fetching single expense ID:', error);
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
export async function updateExpense(expenseId: string, { amount, description, userId, categoryId, date }: ExpenseUpdateInput) { // Destructure updateData
  try {
    const response = await axios.patch(`/api/v1/expense/${expenseId}`, { amount, description, userId, categoryId, date }); // Use destructured properties
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating expense:', error.response?.data);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}


export async function deleteExpense(expenseId: string): Promise<void> {
  try {
    const response = await axios.delete(`/api/v1/expense/${expenseId}`);
    console.log('Expense deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error deleting expense:', error.response?.data);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}


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

