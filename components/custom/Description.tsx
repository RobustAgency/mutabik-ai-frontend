"use client";

import dynamic from 'next/dynamic';
import React from 'react';

interface DescriptionProps {
  title?: string;
  value: string;
  onChange: (content: string) => void;
}

// Dynamically import the TipTap editor with loading fallback
const DescriptionEditor = dynamic(() => import('./DescriptionEditor'), {
  ssr: false,
  loading: () => (
    <div>
      <label className="block text-base font-semibold text-[#171717] mb-2">
        Description
      </label>
      <div className="w-full bg-white rounded-lg shadow border border-gray-200 p-4 min-h-[180px] flex items-center justify-center">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    </div>
  ),
});

export default function Description({ title, value, onChange }: DescriptionProps) {
  return <DescriptionEditor title={title} value={value} onChange={onChange} />;
}