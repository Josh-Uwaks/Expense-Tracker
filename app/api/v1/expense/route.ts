import { NextResponse, NextRequest} from 'next/server'
import prisma from '@/prisma'
import { checkRateLimit } from '@/lib/rateLimiter/rateLimiter';


type ExpenseInput = {
    amount: number;       // Assuming the amount is a number
    description?: string; // Optional field (if it can be missing)
    userId: string;       // Assuming userId is a string
    categoryname: string;   // Assuming categoryId is a string
    date: string
  }

export async function POST(request: NextRequest) {

  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
  // Apply rate limiting
  const isAllowed = await checkRateLimit(ip);
  if (!isAllowed) {
    return NextResponse.json(
      { message: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }
    try {
      const { amount, description, userId, categoryname, date }: ExpenseInput = await request.json();

      console.log(amount, description, userId, categoryname, date)

      if(!amount) return NextResponse.json({message: "kindly provide the amount field"}, {status: 400})
      if(!userId) return NextResponse.json({message: "kindly provide the userId"}, {status: 400})
      if(!categoryname) return NextResponse.json({message: "kindly provide the category"}, {status: 400})
      if(!date) return NextResponse.json({message: "kindly provide the date"}, {status: 400})


    // Check if the user exists in the database
      const userExist = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if(!userExist) {
        return NextResponse.json({message: "This User does not exist."}, {status: 400})
    }

    // Check if categoryId exists in the database
    const categoryExists = await prisma.category.findFirst({
        where: {name: categoryname}
    });
    
    if (!categoryExists) {
        return NextResponse.json({ message: "Invalid category." }, { status: 400 });
    }
      // Create a new expense
      const expense = await prisma.expense.create({
        data: {
          amount,
          description,
          user: { connect: { id: userId } }, // Connect existing user
          category: { connect: { id: categoryExists.id } },
          date
        }
      });
  
      return NextResponse.json({ message: "Expense created successfully", expense }, { status: 201 });

    } catch (error) {
        console.error("Error processing request:", error);
      if (error instanceof SyntaxError) {
        return NextResponse.json({ message: "Invalid JSON format." }, { status: 400 });
    }
    return NextResponse.json({ message: "An error occurred while processing the request." }, { status: 500 });

    } finally {
      await prisma.$disconnect();
    }

  }