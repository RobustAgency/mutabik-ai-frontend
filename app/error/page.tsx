'use client';

export const runtime = 'edge';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BugIcon } from "lucide-react";

export default function ErrorPage() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <BugIcon />
                    </div>
                    <CardTitle className="text-2xl">Something went wrong</CardTitle>
                    <CardDescription>Sorry, an unexpected error occurred.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-sm text-muted-foreground">
                        You can try again or go back to the homepage.
                    </p>
                </CardContent>
                <CardFooter className="gap-3 justify-center">
                    <Link href="/">
                        <Button>Go home</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
