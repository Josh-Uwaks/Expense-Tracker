"use client"

import React, { useState } from "react"; // Import useState
import Sidebar from "../sidebar";
import Navbar from "../navbar";

type DashLayoutProp = {
    children: React.ReactNode
}

export default function DashLayout({children}: DashLayoutProp) {
    const [isExpanded, setIsExpanded] = useState(false); // State to manage sidebar expansion

    const toggleSidebar = () => {
        setIsExpanded((prev) => !prev); // Toggle the expanded state
    };

    console.log({
        "isEx": isExpanded
    })


    return (
        <div className="flex">
           
            <div
                className={`fixed min-w-[${isExpanded ? '300px' : '80px'}] min-h-screen border-r transition-width duration-300`}
            >
                {/* <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} /> */}
            </div>
            <div className={`flex-1 ${isExpanded ? "md:ml-[300px]" : "md:ml-[80px]"} transition-margin duration-300`}>
            <button onClick={toggleSidebar}>Click to check</button>
                <Navbar />
                {children}
            </div>
        </div>
    );
}
