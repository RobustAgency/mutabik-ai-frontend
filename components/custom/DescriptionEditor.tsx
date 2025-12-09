"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";

interface DescriptionEditorProps {
  title?: string;
  value: string;
  onChange: (content: string) => void;
}

export default function DescriptionEditor({ title = "Description", value, onChange }: DescriptionEditorProps) {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
      }),
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
        {title}
      </label>
      <div className="w-full bg-white rounded-lg shadow border border-gray-200 p-0">
        <div className="flex items-center gap-1 px-4 pt-4 pb-2 border-b border-gray-100">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded-md transition-colors ${editor.isActive("bold") ? "bg-blue-100 text-blue-600" : "text-[#404040] hover:bg-gray-100"
              }`}
          >
            <BoldIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-md transition-colors ${editor.isActive("italic") ? "bg-blue-100 text-blue-600" : "text-[#404040] hover:bg-gray-100"
              }`}
          >
            <ItalicIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded-md transition-colors ${editor.isActive("underline") ? "bg-blue-100 text-blue-600" : "text-[#404040] hover:bg-gray-100"
              }`}
          >
            <UnderlineIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("Enter the URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className={`p-2 rounded-md transition-colors ${editor.isActive("link") ? "bg-blue-100 text-blue-600" : "text-[#404040] hover:bg-gray-100"
              }`}
          >
            <LinkIcon size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-md transition-colors ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-600" : "text-[#404040] hover:bg-gray-100"
              }`}
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-md transition-colors ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-600" : "text-[#404040] hover:bg-gray-100"
              }`}
          >
            <ListOrdered size={18} />
          </button>
        </div>
        <div className="px-4 pb-4 pt-2">
          <EditorContent
            editor={editor}
            id="description"
            className="prose prose-sm text-[#171717] w-full rounded-md px-3 py-2 bg-white 
            [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:focus:outline-none 
            [&_.ProseMirror]:focus:border-none [&_.ProseMirror]:focus:ring-0 [&_.ProseMirror]:min-h-[120px]"
          />
        </div>
      </div>
    </div>
  );
}

