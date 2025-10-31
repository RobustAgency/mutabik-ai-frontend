"use client";

export const runtime = 'edge';

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import AiModelCardForm from '@/components/app/aiModel/cards/AiModelCardForm'
import { useGetAiModelCardQuery, useUpdateAiModelCardMutation } from '@/app/lib/features/aiModelCardsApi'

const Page = () => {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { data, isLoading } = useGetAiModelCardQuery(id, { skip: !id });
    const [updateCard, { isLoading: updating }] = useUpdateAiModelCardMutation();

    if (isLoading) return <div className="max-w-7xl mx-auto text-sm text-muted-foreground">Loading...</div>;
    if (!data) return <div className="max-w-7xl mx-auto text-sm text-muted-foreground">Not found</div>;

    return (
        <AiModelCardForm
            mode="edit"
            initial={data}
            loading={updating}
            onSubmit={async (payload) => {
                await updateCard({ id, data: payload }).unwrap();
                router.push('/core-assets/ai-models/cards');
            }}
        />
    )
}

export default Page