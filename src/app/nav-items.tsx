'use client'
import React from 'react';
import Link from "next/link";
import {usePathname} from "next/navigation";

const NavItems = () => {
    const pathname = usePathname()
    return (
        <div className={'flex items-center justify-center gap-5 text-xl p-3'}>
            <Link className={`${pathname === '/' ? 'text-green-400' : 'text-slate-900'} `} href={"/"}>Home</Link>
            <Link className={`${pathname === '/todo' ? 'text-green-400' : 'text-slate-900'} `} href={"/todo"}>Todo</Link>
        </div>
    );
};

export default NavItems;