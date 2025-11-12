import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useGetAiModelsQuery } from '@/app/lib/features/aiModelsApi'
import { useGetAiModelVersionsQuery } from '@/app/lib/features/aiModelVersionsApi'
import { useGetUseCasesQuery } from '@/app/lib/features/useCasesApi'
import { useCreateAiModelUseCaseMutation } from '@/app/lib/features/aiModelUseCasesApi'
import SelectWithInlineCreate from '@/components/custom/SelectWithInlineCreate'
import UseCaseModalForm from '@/components/app/useCases/create/UseCaseModalForm'
import AiModelVersionModalForm from '@/components/app/aiModel/versions/AiModelVersionModalForm'
import AiModelModalForm from '@/components/app/aiModel/create/AiModelModalForm'
import { useRouter } from 'next/navigation'

interface LinkUseCaseFormProps {
    aiModelId?: number // Make optional since we'll select it in the form
    onSuccess?: () => void
    formRef?: React.RefObject<HTMLFormElement>
    onValidityChange?: (isValid: boolean) => void
    isSubmitting?: boolean
    setIsSubmitting?: (value: boolean) => void
}

const LinkUseCaseForm: React.FC<LinkUseCaseFormProps> = ({ aiModelId, onSuccess, formRef, onValidityChange, isSubmitting, setIsSubmitting }) => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        ai_model_id: aiModelId ? String(aiModelId) : '',
        ai_model_version_id: '',
        use_case_id: '',
        relationship_type: 'primary',
        created_by: '',
        updated_by: null as string | null
    })
    const [touched, setTouched] = useState({
        ai_model_id: false,
        use_case_id: false,
        created_by: false
    })
    const [submitAttempted, setSubmitAttempted] = useState(false)

    // Fetch AI models
    const { data: aiModels = [], isLoading: aiModelsLoading } = useGetAiModelsQuery()

    // Fetch AI model versions - only when ai_model_id is selected
    const selectedModelId = formData.ai_model_id ? parseInt(formData.ai_model_id) : undefined
    const { data: versions = [], isLoading: versionsLoading } = useGetAiModelVersionsQuery(
        selectedModelId ? { ai_model_id: selectedModelId } : undefined,
        { skip: !selectedModelId }
    )

    // Fetch use cases
    const { data: useCases = [], isLoading: useCasesLoading } = useGetUseCasesQuery()

    // Create mutation
    const [createLink, { isLoading: isCreating }] = useCreateAiModelUseCaseMutation()

    // Clear ai_model_version_id when ai_model_id changes
    useEffect(() => {
        if (formData.ai_model_id) {
            setFormData(prev => ({
                ...prev,
                ai_model_version_id: '' // Clear version when model changes
            }))
        }
    }, [formData.ai_model_id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitAttempted(true)
        setIsSubmitting?.(true)

        // Mark all fields as touched
        setTouched({
            ai_model_id: true,
            use_case_id: true,
            created_by: true
        })

        // Check for valid selections (not loading or empty state values)
        if (!formData.ai_model_id ||
            !formData.use_case_id ||
            !formData.created_by?.trim() ||
            formData.ai_model_id === 'loading' ||
            formData.use_case_id === 'loading' ||
            formData.use_case_id === 'no-use-cases') {
            setIsSubmitting?.(false)
            return
        }

        try {
            // Build payload - all required fields from form
            const payload: any = {
                ai_model_id: parseInt(formData.ai_model_id),
                use_case_id: parseInt(formData.use_case_id),
                relationship_type: formData.relationship_type
            }

            // Only include ai_model_version_id if it's provided (it's nullable)
            if (formData.ai_model_version_id &&
                formData.ai_model_version_id !== 'loading' &&
                formData.ai_model_version_id !== 'no-versions' &&
                formData.ai_model_version_id.trim() !== '') {
                payload.ai_model_version_id = parseInt(formData.ai_model_version_id)
            }

            // Only include created_by if it's provided
            if (formData.created_by?.trim()) {
                payload.created_by = formData.created_by.trim()
            }

            // Only include updated_by if it's provided
            if (formData.updated_by?.trim()) {
                payload.updated_by = formData.updated_by.trim()
            }

            await createLink(payload).unwrap()

            router.push(`/core-assets/ai-models/link-use-case`)
            onSuccess?.()
            setIsSubmitting?.(false)
        } catch (error: any) {
            console.error('Failed to link use case:', error)
            toast.error(error?.data?.message || 'Failed to link use case. Please try again.')
            setIsSubmitting?.(false)
        }
    }

    const handleChange = (field: string, value: string | null) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Mark field as touched when user interacts
        if (field === 'ai_model_id' || field === 'use_case_id' || field === 'created_by') {
            setTouched(prev => ({
                ...prev,
                [field]: true
            }))
        }
    }

    // Prepare AI model options for SelectWithInlineCreate
    const aiModelOptions = aiModels.map((model) => ({
        id: model.id,
        label: `${model.name} (${model.primary_category?.replace('_', ' ') ?? 'N/A'})`,
        value: String(model.id),
    }))

    // Prepare version options for SelectWithInlineCreate
    const versionOptions = versions.map((version: any) => ({
        id: version.id,
        label: `${version.ai_model?.name ?? "Model"} • ${version.version_number}`,
        value: String(version.id),
    }))

    // Prepare use case options for SelectWithInlineCreate
    const useCaseOptions = useCases.map((useCase: any) => ({
        id: useCase.id,
        label: useCase.name || useCase.title || `Use Case ${useCase.id}`,
        value: String(useCase.id),
    }))

    // Check if form is valid for submit button
    const isFormValid = formData.ai_model_id &&
        formData.use_case_id &&
        formData.created_by?.trim() &&
        formData.ai_model_id !== 'loading' &&
        formData.use_case_id !== 'loading' &&
        formData.use_case_id !== 'no-use-cases';

    // Notify parent of validity changes
    useEffect(() => {
        onValidityChange?.(isFormValid);
    }, [isFormValid, onValidityChange]);

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="space-y-2">
                <Label htmlFor="ai-model" className="text-sm font-medium">
                    Select AI Model <span className="text-red-500">*</span>
                </Label>
                <SelectWithInlineCreate
                    value={String(formData.ai_model_id ?? "")}
                    onValueChange={(v) => handleChange('ai_model_id', v)}
                    options={aiModelOptions}
                    isLoading={aiModelsLoading}
                    isEmpty={!aiModelsLoading && aiModels.length === 0}
                    entityName="AI Model"
                    modalForm={AiModelModalForm}
                    placeholder="Select AI model"
                    error={submitAttempted && touched.ai_model_id && !formData.ai_model_id && formData.ai_model_id !== 'loading'}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="use-case" className="text-sm font-medium">
                    Select Use Case <span className="text-red-500">*</span>
                </Label>
                <SelectWithInlineCreate
                    value={String(formData.use_case_id ?? "")}
                    onValueChange={(v) => handleChange('use_case_id', v)}
                    options={useCaseOptions}
                    isLoading={useCasesLoading}
                    isEmpty={!useCasesLoading && useCases.length === 0}
                    entityName="Use Case"
                    modalForm={UseCaseModalForm}
                    placeholder="Select use case"
                    error={submitAttempted && touched.use_case_id && !formData.use_case_id && formData.use_case_id !== 'loading' && formData.use_case_id !== 'no-use-cases'}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="model-version" className="text-sm font-medium">
                    Choose Model Version
                </Label>
                <SelectWithInlineCreate
                    value={String(formData.ai_model_version_id ?? "")}
                    onValueChange={(v) => handleChange('ai_model_version_id', v || null)}
                    options={versionOptions}
                    isLoading={versionsLoading}
                    isEmpty={!versionsLoading && !!formData.ai_model_id && versions.length === 0}
                    entityName="Model Version"
                    modalForm={AiModelVersionModalForm}
                    placeholder={!formData.ai_model_id ? "Select AI model first" : "Select model version (optional)"}
                    disabled={!formData.ai_model_id}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="relationship-type" className="text-sm font-medium">
                    Relationship Type <span className="text-red-500">*</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="created-by" className="text-sm font-medium">
                        Created By <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="created-by"
                        type="email"
                        value={formData.created_by}
                        onChange={(e) => handleChange('created_by', e.target.value)}
                        placeholder="creator@example.com"
                        required
                        className={submitAttempted && touched.created_by && !formData.created_by?.trim() ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {submitAttempted && touched.created_by && !formData.created_by?.trim() && (
                        <p className="text-xs text-red-600 mt-1">Created by is required</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="updated-by" className="text-sm font-medium">
                        Updated By
                    </Label>
                    <Input
                        id="updated-by"
                        type="email"
                        value={formData.updated_by || ''}
                        onChange={(e) => handleChange('updated_by', e.target.value ? e.target.value : null)}
                        placeholder="updater@example.com"
                    />
                </div>
            </div>
        </form>
    )
}

export default LinkUseCaseForm