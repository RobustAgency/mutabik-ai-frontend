"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "react-toastify"
import { useFormStatus } from "react-dom"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/AuthProvider"
import { updateProfile } from "@/lib/auth-actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="cursor-pointer min-w-[100px] w-max min-h-[40px] text-white" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}

export default function ProfileForm() {
  const { user, fetchProfile } = useAuth()
  const formRef = useRef<HTMLFormElement | null>(null)

  const email = user?.email ?? ""
  const initialFullName = useMemo(() => {
    const meta = user?.user_metadata as Record<string, unknown> | undefined
    const nameFromMeta = typeof meta?.full_name === "string" ? meta?.full_name : ""
    return nameFromMeta
  }, [user])
  const [fullName, setFullName] = useState<string>(initialFullName)

  const [state, formAction] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      return await updateProfile(formData)
    },
    null as null | { success: boolean; message?: string }
  )

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Profile updated")
      void fetchProfile()
    } else if (state.message) {
      toast.error(state.message)
    }
  }, [state, fetchProfile])

  return (
    <Card className="px-5">
      <CardHeader>
        <CardTitle className="text-2xl">Profile</CardTitle>
        <CardDescription>Update your name. Email cannot be changed.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" disabled name="email" type="email" defaultValue={email} readOnly aria-readonly />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


    