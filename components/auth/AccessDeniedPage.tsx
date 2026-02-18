"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX } from "lucide-react";

interface AccessDeniedPageProps {
  /** Custom message to display (optional) */
  message?: string;
  /** Where to redirect when user clicks the button (default: /dashboard) */
  redirectTo?: string;
  /** Custom button text (optional) */
  buttonText?: string;
}

export function AccessDeniedPage({
  message,
  redirectTo = "/dashboard",
  buttonText = "Go to Dashboard",
}: AccessDeniedPageProps) {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(redirectTo);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#FEF3F2]">
            <ShieldX className="h-8 w-8 text-[#F04438]" />
          </div>
          <CardTitle className="text-2xl font-semibold text-[#1D2939]">
            Access Denied
          </CardTitle>
          <CardDescription className="text-[#667085]">
            {message || "You do not have permission to access this page."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-[#667085]">
            Please contact your administrator if you believe this is an error.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            onClick={handleRedirect}
            className="h-10 bg-[#4FD58F] text-white text-sm font-medium px-6 hover:bg-[#3FC57F]"
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

