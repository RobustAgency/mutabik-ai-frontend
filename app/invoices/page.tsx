'use client'



import React from 'react'
import { useInvoices, useUpcomingInvoice } from '@/hooks/app/usePlans'
import Spinner from '@/components/ui/spinner'
import { X } from 'lucide-react'
import UpcomingInvoice from '@/components/app/invoices/UpcomingInvoice'
import InvoiceHistory from '@/components/app/invoices/InvoiceHistory'
import ContainerCard from '@/components/custom/ContainerCard'

const InvoicesPage = () => {
    const { invoices, loading: invoicesLoading, error: invoicesError } = useInvoices()
    const { upcomingInvoice, loading: upcomingLoading, error: upcomingError } = useUpcomingInvoice()

    if (invoicesLoading && upcomingLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        )
    }

    if (invoicesError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Invoices</h3>
                    <p className="text-gray-600">{invoicesError}</p>
                </div>
            </div>
        )
    }

    return (
        <ContainerCard
            title="Invoices & Billing"
            description="Manage your billing history and upcoming payments"
        >
            <UpcomingInvoice upcomingInvoice={upcomingInvoice} upcomingLoading={upcomingLoading} upcomingError={upcomingError} />

            <InvoiceHistory invoices={invoices} invoicesLoading={invoicesLoading} />

        </ContainerCard>
    )
}

export default InvoicesPage