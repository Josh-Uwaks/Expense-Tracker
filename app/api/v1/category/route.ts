import {NextRequest, NextResponse} from 'next/server'
import prisma from '@/prisma'
import { checkRateLimit } from '@/lib/rateLimiter/rateLimiter';

type CategoryInput = {
    name: string,
    userId: string
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
      
      const { name, userId }: CategoryInput = await request.json();
      // Validate required fields
      if (!name || !userId) {
        return NextResponse.json({ message: "Invalid Fields, kindly ensure field is not empty" }, { status: 400 });
      }

      const userExist = await prisma.user.findFirst({
        where: {
            id: userId
        }
      })

      if(!userExist) {
        return NextResponse.json({message: 'Invalid User ID'}, {status: 400})
      }

      const lowerCase = name.toLowerCase()


      const checkcategory = await prisma.category.findFirst({
        where: {
          name: lowerCase,
          userId: userId
        }
      })

      if(checkcategory) {
        return NextResponse.json({message: "This Entry Already Exists"}, {status: 400})
      }

      // Create a new expense
      const category = await prisma.category.create({
        data: {
          name: lowerCase,
          userId
        }
      });
  
      return NextResponse.json({ message: "Category created successfully", category }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "An error occurred while creating the category." }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }

  }