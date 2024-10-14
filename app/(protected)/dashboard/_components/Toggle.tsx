"use client";

import React, { useEffect, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { sidebarMenu } from "@/components/data/data";
import { DollarSign, LogOut } from 'lucide-react';
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function ToggleNav() {
    const [isDrawer, setIsDrawer] = React.useState(false);
    const drawerRef = useRef<HTMLDivElement>(null); // Ref for the drawer

    const drawerHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDrawer((prev) => !prev);
    };

    // Close the drawer when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                setIsDrawer(false); // Close the drawer if clicked outside
            }
        };

        if (isDrawer) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDrawer]);

    const logout = async() => {
        await signOut()
        setIsDrawer(false)
    }

    return (
        <>
            <div className="md:hidden cursor-pointer" onClick={drawerHandler} aria-label="Toggle Navigation">
                <RxHamburgerMenu size={20} />
            </div>

            <div
                ref={drawerRef} // Ref to the drawer div
                className={`fixed top-0 left-0 w-[300px] h-screen bg-gray-800 z-10 overflow-scroll transition-transform duration-200 ${
                    isDrawer ? "transform translate-x-0" : "transform -translate-x-[300px]"
                }`}
                aria-hidden={!isDrawer}
            >
                <div className="flex items-center px-4 my-8 text-white">
                    <DollarSign size={40} className="font-extrabold" />
                    <h1 className="tracking-widest font-bold text-2xl">Trackify</h1>
                </div>

                <ul className="px-6">
                    {sidebarMenu.map((item, index) => (
                        <li key={index} className="p-3 cursor-pointer hover:bg-gray-800 rounded-md" onClick={() => setIsDrawer(false)}>
                            <Link href={item.link} className="flex items-center gap-2 text-white">
                                <item.icon />
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>


                <div className='p-8 mt-[400px] text-red-600'>
                <button onClick={logout} className='flex items-center gap-2'>
                    <LogOut size={30} />
                    LogOut
                </button>
            </div>
            </div>
        </>
    );
}
