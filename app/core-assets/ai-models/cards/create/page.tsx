"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import AiModelCardForm from '@/components/app/aiModel/cards/AiModelCardForm'
import { useCreateAiModelCardMutation } from '@/app/lib/features/aiModelCardsApi'
import { PermissionPage } from "@/components/auth/PermissionPage";
import { PERMISSIONS } from "@/constants/permissions";

const Page = () => {
    const router = useRouter();
    const [createCard, { isLoading }] = useCreateAiModelCardMutation();

    return (
        <PermissionPage permission={PERMISSIONS.AI_MODEL_CARDS_CREATE}>
            <AiModelCardForm
                mode="create"
                loading={isLoading}
                onSubmit={async (data) => {
                    const result = await createCard(data).unwrap();
                    router.push('/core-assets/ai-models/cards');
                    return void result;
                }}
            />
        </PermissionPage>
    )
}

export default Page