"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface FrameworkStatusProps {
    releaseDate: string;
    published: boolean;
    onReleaseDateChange: (date: string) => void;
    onPublishedChange: (published: boolean) => void;
}

export default function FrameworkStatus({ 
    releaseDate, 
    published, 
    onReleaseDateChange, 
    onPublishedChange 
}: FrameworkStatusProps) {
    return (
        <Card className="bg-white w-full mb-6">
            <div>
                <h1 className="pl-6 text-[#171717] text-lg font-semibold">Status</h1>
            </div>
            <Separator />
            <CardContent className="pl-6 flex flex-col gap-4">
                <div>
                    <Label
                        htmlFor="release-date"
                        className="font-medium text-sm text-[#171717]"
                    >
                        Release date
                    </Label>
                    <Input
                        id="release-date"
                        type="date"
                        value={releaseDate}
                        onChange={(e) => onReleaseDateChange(e.target.value)}
                        className="mt-2 text-[#171717]"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Switch
                        checked={published}
                        onCheckedChange={onPublishedChange}
                        id="published"
                        className="data-[state=checked]:bg-[#4FD58F] data-[state=unchecked]:bg-gray-300"
                    />
                    <Label
                        htmlFor="published"
                        className="font-medium text-sm text-[#171717]"
                    >
                        Published
                    </Label>
                </div>
            </CardContent>
        </Card>
    );
}
