import { MacbookScrollDemo } from "@/components/hero";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="max-w-[1440px] mx-auto h-screen">
      
      <Navbar/>

       <Section/>


    </div>
  );
}



const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-6">
      <h1>Logo</h1>
      <Button>Get Started</Button>
    </nav>
  )
}

const Section = () => {
  return (
        <section className="bg-[#F7F7F7] rounded-[25px] pt-28 border-[1px] border-[#a8a8a8] mx-auto max-w-screen-xl lg:items-center">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="md:text-[50px] text-4xl font-bold">Title Goes in here</h1>
            <p className="mt-6"> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt illo tenetur fuga ducimus
            numquam ea!</p>
            <div className="mt-6 flex gap-4 justify-center">
              <Button>Get Started</Button>
              <Button variant={'ghost'} className="shadow-md">Learn More</Button>
            </div>
          </div>
          <MacbookScrollDemo/>
        </section>
  )
}
