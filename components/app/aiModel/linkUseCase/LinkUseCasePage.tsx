"use client";

import React, { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LinkUseCaseForm from '../AiModelDetails/linkedUseCases/LinkUseCaseForm'

const LinkUseCasePage: React.FC = () => {
    const formRef = useRef<HTMLFormElement>(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSuccess = () => {
        // Form already shows toast, this is just for any additional cleanup
        setIsSubmitting(false);
    }

    const handleSubmit = () => {
        if (formRef.current && isFormValid) {
            setIsSubmitting(true);
            formRef.current.requestSubmit();
        }
    };

    return (
        <div className="mx-auto max-w-7xl">
            <Card className='p-6'>
                <CardHeader className="flex flex-col sm:flex-row items-start gap-3 justify-start sm:justify-between">
                    <div>
                        <CardTitle>Link Use Case to AI Model</CardTitle>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        className="bg-[#4FD58F] text-white"
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? 'Linking...' : 'Link Use Case'}
                    </Button>
                </CardHeader>
                <CardContent>
                    <LinkUseCaseForm 
                        onSuccess={handleSuccess} 
                        formRef={formRef}
                        onValidityChange={setIsFormValid}
                        isSubmitting={isSubmitting}
                        setIsSubmitting={setIsSubmitting}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default LinkUseCasePage

