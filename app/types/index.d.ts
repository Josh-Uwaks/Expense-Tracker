import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export type Payment = {
  id: string
  amount: number
  category: string
  description: string
  date: string
  // status: "pending" | "processing" | "success" | "failed"
}

export type Category = {
  id: string;
  name: string;
  userId: string;
  createdAt: string
}

export type CategoryResponse = {
  message: string,
  getCategoryById: Category[]
}

// types.ts
export type Expense = {
    id: string;
    userId: string;
    amount: number;
    description: string;
    category: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

  
export type ExpenseResponse = {
    message: string,
    getExpenseId: Expense[];
};


export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
}

export type UserResponse = {
  message: string,
  findUser: User
}

//profile update

export type UserProfileUpdate = {
  firstname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: string;
  password?: string;
};

  // Add user ID to the session object
declare module "next-auth" {
  interface Session {
      user: {
          id: string;
          email: string;
          name: string;
          image: string;
      }
  }
}

// Add user ID to the JWT token
// declare module "next-auth/jwt" {
//   interface JWT {
//       sub: string;
//   }
// }
