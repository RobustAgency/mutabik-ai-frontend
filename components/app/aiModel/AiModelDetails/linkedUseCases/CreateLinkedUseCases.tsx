import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import LinkUseCaseForm from './LinkUseCaseForm';

interface CreateLinkedUseCasesProps {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    aiModelId: number;
}

const CreateLinkedUseCases: React.FC<CreateLinkedUseCasesProps> = ({ dialogOpen, setDialogOpen, aiModelId }) => {
    const handleSuccess = () => {
        setDialogOpen(false)
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent showCloseButton>
                <DialogHeader>
                    <DialogTitle>Link use case</DialogTitle>
                </DialogHeader>
                <LinkUseCaseForm aiModelId={aiModelId} onSuccess={handleSuccess} />
            </DialogContent>
        </Dialog>
    )
}

export default CreateLinkedUseCases