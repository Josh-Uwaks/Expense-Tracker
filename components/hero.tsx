import React from "react";
import { MacbookScroll } from "@/components/ui/macbook-scroll"
import Link from "next/link";

export function MacbookScrollDemo() {
  return (
    <div className="overflow-hidden dark:bg-[#0B0B0F] w-full">
      <MacbookScroll
        // title={
        //   <span>
        //     This Macbook is built with Tailwindcss. <br /> No kidding.
        //   </span>
        // }
        
        src={`/expensetracker_bg.png`}
        showGradient={false}
      />
    </div>
  );
}
