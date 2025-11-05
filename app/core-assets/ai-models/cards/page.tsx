"use client";



import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetAiModelCardsQuery } from '@/app/lib/features/aiModelCardsApi'
import { formatDateISO } from '@/lib/helpers/date'

const Page = () => {
    const router = useRouter();
    const { data: cards = [], isLoading } = useGetAiModelCardsQuery();

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            'in_review': 'Draft',
            'published': 'Published',
            'draft': 'Draft',
            'archived': 'Archived'
        };
        return statusMap[status] || status;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="w-full rounded-2xl border border-[#E4E7EC] bg-white flex flex-col gap-4 mx-auto px-4 sm:px-6 py-4">
                <CardContent className="flex flex-col flex-1 gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-[#000000]">All Model Version Cards</h2>
                        <Button onClick={() => router.push('/core-assets/ai-models/cards/create')} className="h-[40px] bg-[#4FD58F] text-white text-sm font-medium px-4">New model version card</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoading ? (
                            <div className="text-sm text-muted-foreground">Loading...</div>
                        ) : cards.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No cards found</div>
                        ) : (
                            cards.map((card) => (
                                <Card key={card.id} className="rounded-2xl border border-[#E4E7EC] bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-col gap-4">
                                        {/* Header with title and badge */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-[#101828] leading-7">
                                                    {card.title}
                                                </h3>
                                                <p className="text-sm text-[#667085] mt-1">
                                                    {Array.isArray(card.organizational_context) ? card.organizational_context.join(', ') : card.organizational_context || 'N/A'} • {card.version_id}
                                                </p>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-md bg-[#EFF8FF] text-[#175CD3] text-xs font-medium">
                                                {getStatusLabel(card.status)}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-[#475467] leading-5 line-clamp-3">
                                            {card.intended_use || card.model_overview || 'No description available'}
                                        </p>

                                        {/* Dates */}
                                        <div className="flex items-center justify-between gap-4 text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-[#667085] text-xs">Last Review Date</span>
                                                <span className="text-[#101828] font-medium mt-1">
                                                    {formatDateISO(card.last_review_date)}
                                                </span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-[#667085] text-xs">Next Review Date</span>
                                                <span className="text-[#101828] font-medium mt-1">
                                                    {formatDateISO(card.next_review_date)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Completeness Score */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-[#344054] font-medium">STATUS</span>
                                                <span className="text-sm text-[#344054] font-semibold">{getStatusLabel(card.status)}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-3 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/core-assets/ai-models/cards/${card.id}`)}
                                                className="flex-1 h-10 border-[#D0D5DD] text-[#344054] hover:bg-[#F9FAFB]"
                                            >
                                                Edit
                                            </Button>
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