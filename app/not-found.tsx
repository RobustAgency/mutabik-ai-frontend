import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function NotFound() {
    return (
        <section className="min-h-[85vh] flex flex-col justify-center text-center items-center relative z-10">
            <h1 className="text-6xl font-heading font-bold">404 Not Found</h1>
            <div className="mt-5">
                <Link href={"/"}>
                    <Button variant="default">
                        Back to Home
                    </Button>
                </Link>
            </div>
        </section>
    );
}


