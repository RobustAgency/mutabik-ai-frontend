"use client";

// import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Edit, Eye, Trash2 } from 'lucide-react'
import React from 'react'

interface DetailsHeaderProps {
    aiModel: {
        id: string | number;
        name: string;
    };
}

const DetailsHeader: React.FC<DetailsHeaderProps> = ({ aiModel }) => {
    // const router = useRouter();
    return (
        <Card className='border-none'>
            <CardContent className="px-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/core-assets/ai-models")}
                            className="flex items-center gap-2 text-[#667085] hover:text-[#1D2939]"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-sans text-sm font-medium">Back</span>
                        </Button> */}
                        <div>
                            <h1 className="font-sans font-semibold text-xl sm:text-2xl text-[#1D2939]">{aiModel.name}</h1>
                            <p className="font-sans text-xs sm:text-sm text-[#667085] mt-1">AI Model ID: {aiModel.id}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-[#E4E7EC] text-[#667085] hover:bg-gray-50"
                        >
                            <Eye className="w-4 h-4" />
                            <span className="font-sans text-sm">View Versions</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-[#E4E7EC] text-[#667085] hover:bg-gray-50"
                        >
                            <Edit className="w-4 h-4" />
                            <span className="font-sans text-sm">Edit</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-[#E4E7EC] text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="font-sans text-sm">Delete</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default DetailsHeader