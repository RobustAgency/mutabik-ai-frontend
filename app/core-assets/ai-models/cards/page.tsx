"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetAiModelCardsQuery } from '@/app/lib/features/aiModelCardsApi'

const Page = () => {
    const router = useRouter();
    const { data: cards = [], isLoading } = useGetAiModelCardsQuery();

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
                <CardContent className="flex flex-col flex-1 gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">All Model Version Cards</h2>
                        <Button onClick={() => router.push('/core-assets/ai-models/cards/create')} className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4">New model version card</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {isLoading ? (
                            <div className="text-sm text-muted-foreground">Loading...</div>
                        ) : cards.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No cards found</div>
                        ) : (
                            cards.map((c) => (
                                <Card key={c.id} className="rounded-xl border border-[#E4E7EC]">
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium text-sm">{c.title}</div>
                                            <span className="text-xs text-muted-foreground">{c.status}</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{c.version}</div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => router.push(`/core-assets/ai-models/cards/${c.id}`)}>Edit</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page