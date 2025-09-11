import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import type { CreateTagRequest } from '@/interfaces/Tag'

interface CreateTagDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: CreateTagRequest) => Promise<void>
    isCreating: boolean
}

export default function CreateTagDialog({ open, onOpenChange, onSubmit, isCreating }: CreateTagDialogProps) {
    const [group, setGroup] = useState('')
    const [namesInput, setNamesInput] = useState('')
    const [tagPills, setTagPills] = useState<string[]>([])

    const handleNamesInputChange = (value: string) => {
        setNamesInput(value)

        // Split by comma and filter out empty strings
        const tags = value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)

        setTagPills(tags)
    }

    const removeTag = (indexToRemove: number) => {
        const updatedTags = tagPills.filter((_, index) => index !== indexToRemove)
        setTagPills(updatedTags)
        setNamesInput(updatedTags.join(', '))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!group.trim()) {
            return
        }

        if (tagPills.length === 0) {
            return
        }

        try {
            await onSubmit({
                group: group.trim(),
                names: tagPills
            })

            // Reset form
            setGroup('')
            setNamesInput('')
            setTagPills([])
            onOpenChange(false)
        } catch (error) {
            // Error handling is done in the hook
        }
    }

    const handleClose = () => {
        setGroup('')
        setNamesInput('')
        setTagPills([])
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Tags</DialogTitle>
                    <DialogDescription>
                        Add new tags to organize your compliance library content.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="group">Group</Label>
                        <Input
                            id="group"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                            placeholder="Enter tag group name"
                            required
                            disabled={isCreating}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="names">Tag Names</Label>
                        <Input
                            id="names"
                            value={namesInput}
                            onChange={(e) => handleNamesInputChange(e.target.value)}
                            placeholder="Enter tag names separated by commas (e.g., tag1, tag2, tag3)"
                            required
                            disabled={isCreating}
                        />

                        {/* Tag Pills */}
                        {tagPills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {tagPills.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeTag(index)}
                                            className="hover:bg-blue-200 rounded-full p-0.5"
                                            disabled={isCreating}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isCreating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating || !group.trim() || tagPills.length === 0}
                        >
                            {isCreating ? 'Creating...' : 'Create Tags'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
