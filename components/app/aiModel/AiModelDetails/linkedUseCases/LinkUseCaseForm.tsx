import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useGetAiModelVersionsQuery } from '@/app/lib/features/aiModelVersionsApi'
import { useGetUseCasesQuery } from '@/app/lib/features/useCasesApi'
import { useCreateAiModelUseCaseMutation } from '@/app/lib/features/aiModelUseCasesApi'

interface LinkUseCaseFormProps {
    aiModelId: number
    onSuccess?: () => void
}

const LinkUseCaseForm: React.FC<LinkUseCaseFormProps> = ({ aiModelId, onSuccess }) => {
    const [formData, setFormData] = useState({
        ai_model_version_id: '',
        use_case_id: '',
        relationship_type: 'primary'
    })

    // Fetch AI model versions
    const { data: versions = [], isLoading: versionsLoading } = useGetAiModelVersionsQuery(aiModelId)

    // Fetch use cases
    const { data: useCases = [], isLoading: useCasesLoading } = useGetUseCasesQuery()

    // Create mutation
    const [createLink, { isLoading: isCreating }] = useCreateAiModelUseCaseMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Check for valid selections (not loading or empty state values)
        if (!formData.ai_model_version_id ||
            !formData.use_case_id ||
            formData.ai_model_version_id === 'loading' ||
            formData.ai_model_version_id === 'no-versions' ||
            formData.use_case_id === 'loading' ||
            formData.use_case_id === 'no-use-cases') {
            return
        }

        try {
            await createLink({
                ai_model_id: aiModelId,
                ai_model_version_id: parseInt(formData.ai_model_version_id),
                use_case_id: parseInt(formData.use_case_id),
                relationship_type: formData.relationship_type
            }).unwrap()

            // Reset form
            setFormData({
                ai_model_version_id: '',
                use_case_id: '',
                relationship_type: 'primary'
            })

            onSuccess?.()
        } catch (error) {
            console.error('Failed to link use case:', error)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label htmlFor="model-version" className="text-sm font-medium">
                    Choose model version
                </Label>
                <Select
                    value={formData.ai_model_version_id}
                    onValueChange={(value) => handleChange('ai_model_version_id', value)}
                    disabled={versionsLoading}
                    required
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select model version" />
                    </SelectTrigger>
                    <SelectContent>
                        {versionsLoading ? (
                            <SelectItem value="loading" disabled>
                                Loading versions...
                            </SelectItem>
                        ) : versions.length === 0 ? (
                            <SelectItem value="no-versions" disabled>
                                No model versions available
                            </SelectItem>
                        ) : (
                            versions.map((version) => (
                                <SelectItem key={version.id} value={version.id.toString()}>
                                    {version.version}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
                {versionsLoading && (
                    <p className="text-sm text-muted-foreground">Loading versions...</p>
                )}
                {!versionsLoading && versions.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No model versions found. Please create a version first.
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="use-case" className="text-sm font-medium">
                    Select use case
                </Label>
                <Select
                    value={formData.use_case_id}
                    onValueChange={(value) => handleChange('use_case_id', value)}
                    disabled={useCasesLoading}
                    required
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select use case" />
                    </SelectTrigger>
                    <SelectContent>
                        {useCasesLoading ? (
                            <SelectItem value="loading" disabled>
                                Loading use cases...
                            </SelectItem>
                        ) : useCases.length === 0 ? (
                            <SelectItem value="no-use-cases" disabled>
                                No use cases available
                            </SelectItem>
                        ) : (
                            useCases.map((useCase) => (
                                <SelectItem key={useCase.id} value={useCase.id.toString()}>
                                    {useCase.title}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
                {useCasesLoading && (
                    <p className="text-sm text-muted-foreground">Loading use cases...</p>
                )}
                {!useCasesLoading && useCases.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No use cases found. Please create a use case first.
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="relationship-type" className="text-sm font-medium">
                    Relationship type
                </Label>
                <Select
                    value={formData.relationship_type}
                    onValueChange={(value) => handleChange('relationship_type', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select relationship type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="supporting">Supporting</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DialogFooter>
                <Button
                    className="bg-[#4FD58F] text-white mt-4"
                    type="submit"
                    disabled={
                        isCreating ||
                        !formData.ai_model_version_id ||
                        !formData.use_case_id ||
                        formData.ai_model_version_id === 'loading' ||
                        formData.ai_model_version_id === 'no-versions' ||
                        formData.use_case_id === 'loading' ||
                        formData.use_case_id === 'no-use-cases'
                    }
                >
                    {isCreating ? 'Linking...' : 'Add use case'}
                </Button>
            </DialogFooter>
        </form>
    )
}

export default LinkUseCaseForm