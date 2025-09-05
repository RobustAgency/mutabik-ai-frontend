"use client";

import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Code2,
  Table2,
  Image as ImageIcon,
} from "lucide-react";

interface DescriptionProps {
  value: string;
  onChange: (content: string) => void;
}

export default function Description({ value, onChange }: DescriptionProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: "Enter description...",
        emptyEditorClass: "text-gray-400",
        showOnlyWhenEditable: false,
      }),
    ],
    content: value,
    editable: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  // ✅ Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file); // Convert to Base64
    }
  };

  return (
    <div>
      <label
        htmlFor="description"
        className="block text-base font-semibold text-[#171717] mb-2"
      >
        Description
      </label>
      <div className="w-full bg-white rounded-lg shadow border border-gray-200 p-0">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-4 pt-4 pb-2 border-b border-gray-100">
          <button
            type="button"
            aria-label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-md transition-colors ${
              editor.isActive("bold")
                ? "bg-blue-100 text-blue-600"
                : "text-[#404040] hover:bg-gray-100"
            }`}
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            aria-label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-md transition-colors ${
              editor.isActive("italic")
                ? "bg-blue-100 text-blue-600"
                : "text-[#404040] hover:bg-gray-100 font-bold"
            }`}
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            aria-label="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-md transition-colors ${
              editor.isActive("underline")
                ? "bg-blue-100 text-blue-600"
                : "text-[#404040] hover:bg-gray-100"
            }`}
          >
            <UnderlineIcon size={18} />
          </button>
          <button
            type="button"
            aria-label="Link"
            onClick={() => {
              const url = window.prompt("Enter the URL");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`p-2 rounded-md transition-colors ${
              editor.isActive("link")
                ? "bg-blue-100 text-blue-600"
                : "text-[#404040] hover:bg-gray-100"
            }`}
          >
            <LinkIcon size={18} />
          </button>
          <button
            type="button"
            aria-label="Code"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-md transition-colors ${
              editor.isActive("codeBlock")
                ? "bg-blue-100 text-blue-600"
                : "text-[#404040] hover:bg-gray-100"
            }`}
          >
            <Code2 size={18} />
          </button>
          <button
            type="button"
            aria-label="Table"
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 2, cols: 2, withHeaderRow: true })
                .run()
            }
            className="p-2 rounded-md transition-colors text-[#404040] hover:bg-gray-100"
          >
            <Table2 size={18} />
          </button>

          {/* ✅ Image Upload */}
          <button
            type="button"
            aria-label="Image"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-md transition-colors text-[#404040] hover:bg-gray-100"
          >
            <ImageIcon size={18} />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Editor Area */}
        <div className="px-4 pb-4 pt-2">
          <EditorContent
            editor={editor}
            id="description"
            className="prose prose-sm text-[#171717] w-full rounded-md px-3 py-2 bg-white 
            [&_.ProseMirror]:outline-none 
            [&_.ProseMirror]:border-none 
            [&_.ProseMirror]:focus:outline-none 
            [&_.ProseMirror]:focus:border-none 
            [&_.ProseMirror]:focus:ring-0 
            [&_.ProseMirror]:min-h-[120px]"
          />
        </div>
      </div>
    </div>
  );
}
