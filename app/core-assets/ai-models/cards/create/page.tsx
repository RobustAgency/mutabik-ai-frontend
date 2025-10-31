"use client";



import React from 'react'
import { useRouter } from 'next/navigation'
import AiModelCardForm from '@/components/app/aiModel/cards/AiModelCardForm'
import { useCreateAiModelCardMutation } from '@/app/lib/features/aiModelCardsApi'

const Page = () => {
    const router = useRouter();
    const [createCard, { isLoading }] = useCreateAiModelCardMutation();

    return (
        <AiModelCardForm
            mode="create"
            loading={isLoading}
            onSubmit={async (data) => {
                const result = await createCard(data).unwrap();
                router.push('/core-assets/ai-models/cards');
                return void result;
            }}
        />
    )
}

export default Page