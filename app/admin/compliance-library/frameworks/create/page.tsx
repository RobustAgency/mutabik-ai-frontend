"use client"

export const runtime = 'edge';
import React from "react";
import { useRouter } from "next/navigation";
import FrameworkForm from "@/components/admin/frameworks/createFramework/FrameworkForm";

export default function CreateFrameworkPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/admin/frameworks');
  };

  return (
    <FrameworkForm
      isEditing={false}
      onCancel={handleCancel}
    />
  );
}
