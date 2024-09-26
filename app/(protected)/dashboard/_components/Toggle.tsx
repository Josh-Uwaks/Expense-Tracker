"use client";

import React, { useEffect, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { sidebarMenu } from "@/components/data/data";
import { DollarSign } from 'lucide-react';
import Link from "next/link";

export default function ToggleNav() {
    const [isDrawer, setIsDrawer] = React.useState(false);
    const drawerRef = useRef<HTMLDivElement>(null); // ref for the drawer

    const drawerHandler = async (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDrawer(!isDrawer);
    };

    // Close the drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                setIsDrawer(false); // Close the drawer if clicked outside
            }
        };

        // Add event listener when the drawer is open
        if (isDrawer) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDrawer]);

    return (
        <>
            <div className="md:hidden" onClick={drawerHandler}>
                <RxHamburgerMenu size={20} />
            </div>

            <div
                ref={drawerRef} // ref to the drawer div
                className={`${
                    isDrawer ? "fixed transform translate-x-0" : "fixed -translate-x-[300px]"
                } bg-[#676f7b] z-10 w-[300px] h-screen top-0 left-0 overflow-scroll transition-transform duration-200 md:hidden`}
            >

            <div className='flex items-center px-4 my-8 text-white'>
                <DollarSign size={40} className='font-extrabold'/>
                <h1 className=' tracking-widest font-bold text-2xl'>Trackify</h1>
            </div>

                <ul className="px-6">
                    {sidebarMenu.map((item, index) => (
                        <li key={index} className="p-3 cursor-pointer hover:bg-gray-800 hover:text-white rounded-md" onClick={() => (setIsDrawer(false))}><Link href={item.link} className='flex items-center gap-2'><item.icon />{item.title}</Link></li>
                    ))}
                </ul>
            </div>
        </>
    );
}
