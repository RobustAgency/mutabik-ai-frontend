"use client";

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LinkUseCaseForm from '../AiModelDetails/linkedUseCases/LinkUseCaseForm'

const LinkUseCasePage: React.FC = () => {
    const handleSuccess = () => {
        // Form already shows toast, this is just for any additional cleanup
    }

    return (
        <div className="mx-auto">
            <Card className='p-6'>
                <CardHeader>
                    <CardTitle>Link Use Case to AI Model</CardTitle>
                    {/* <CardDescription>
                        Link a use case to an AI model
                    </CardDescription> */}
                </CardHeader>
                <CardContent>
                    <LinkUseCaseForm onSuccess={handleSuccess} />
                </CardContent>
            </Card>
        </div>
    )
}

export default LinkUseCasePage

