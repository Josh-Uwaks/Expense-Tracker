import { MacbookScrollDemo } from "@/components/hero";
import LearnMore from "./(protected)/dashboard/_components/modal/modal";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-[1440px] mx-auto h-screen bg-gradient-to-b from-white to-gray-50">
      
      <Navbar />

      <Section />
      
    </div>
  );
}

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-6">
      <div className='flex items-center text-gray-800'>
        <DollarSign size={40} className='font-extrabold text-blue-600' />
        <h1 className='tracking-widest font-bold text-2xl text-gray-900 ml-2'>Trackify</h1>
      </div>

      <Button
        className=" bg-gradient-to-r from-blue-600 to-teal-400 rounded-md text-white text-sm p-6 shadow-md transition-transform hover:scale-105"
      >
        <Link href={'/auth/register'}>
        Get Started
        </Link>
      </Button>
    </nav>
  );
}

const Section = () => {
  return (
    <section className="bg-white rounded-[25px] pt-28 border border-gray-200 mx-auto max-w-screen-xl lg:items-center shadow-lg overflow-hidden">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="md:text-[50px] text-4xl font-bold text-gray-800">Track Your Expense</h1>
        <p className="mt-6 text-gray-600">
          I built this application to track my daily expenses and gain insights into my spending habits on both a daily and monthly basis. 
          It’s fully functional, and you can explore it as well.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Button 
    
            className="bg-gradient-to-r from-blue-600 to-teal-400 rounded-md text-white text-sm p-6 shadow-md hover:scale-105 transition-transform"
          >
            <Link href={'/auth/register'}>
              Get Started
            </Link>
          </Button>

          <LearnMore />
        </div>
      </div>
      <MacbookScrollDemo />
    </section>
  );
}
