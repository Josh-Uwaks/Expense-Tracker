import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";


export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return(
        <div className="text-[14px]">
            <div className="fixed min-w-[300px] min-h-screen border-r">
                <Sidebar/>
            </div>

            <div className="ml-[300px]">
                <Navbar/>
                {children}
            </div>

        </div>
    )
}