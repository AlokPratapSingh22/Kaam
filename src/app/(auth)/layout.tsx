"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { QueryProvider } from "@/components/query-provider";

import Link from "next/link";

interface AuthLayoutProps {
    children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    const pathname = usePathname();
    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center">
                    <Image src="logo.svg" width={120} height={56} alt="Logo" />
                    <Button asChild variant="secondary">
                        <Link href={pathname == "/sign-in" ? "/sign-up" : "sign-in"}>
                            {pathname == "/sign-in" ? "Sign Up" : "Sign In"}
                        </Link>
                    </Button>
                </nav>
                <div className="flex justify-center items-center flex-col pt-4 md:pt-14">
                    <QueryProvider>
                        {children}
                    </QueryProvider>
                </div>
            </div>
        </main>
    );
}

export default AuthLayout