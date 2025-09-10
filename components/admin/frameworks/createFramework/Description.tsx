"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";

interface DescriptionProps {
  value: string;
  onChange: (content: string) => void;
}

export default function Description({ value, onChange }: DescriptionProps) {
  console.log("value", value)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
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

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) return null;

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
            className={`p-2 rounded-md transition-colors ${editor.isActive("bold")
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
            className={`p-2 rounded-md transition-colors ${editor.isActive("italic")
                ? "bg-blue-100 text-blue-600"
                : "text-[#404040] hover:bg-gray-100"
              }`}
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            aria-label="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-md transition-colors ${editor.isActive("underline")
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
            className={`p-2 rounded-md transition-colors ${editor.isActive("link")
                ? "bg-blue-100 text-blue-600"
                : "text-[#404040] hover:bg-gray-100"
              }`}
          >
            <LinkIcon size={18} />
          </button>
          <button
            type="button"
            aria-label="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-md transition-colors ${editor.isActive("bulletList")
                ? "bg-blue-100 text-blue-600"
                : "text-[#404040] hover:bg-gray-100"
              }`}
          >
            <List size={18} />
          </button>
          <button
            type="button"
            aria-label="Numbered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-md transition-colors ${editor.isActive("orderedList")
                ? "bg-blue-100 text-blue-600"
                : "text-[#404040] hover:bg-gray-100"
              }`}
          >
            <ListOrdered size={18} />
          </button>
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
