"use client";
import {
  LuHeading2,
  LuBold,
  LuItalic,
  LuList,
  LuListOrdered,
} from "react-icons/lu";

import { Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import React from "react";

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const buttons = [
    {
      name: "heading",
      onPressed: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      icon: <LuHeading2 />,
    },
    {
      name: "bold",
      onPressed: () => editor.chain().focus().toggleBold().run(),
      icon: <LuBold />,
    },
    {
      name: "italic",
      onPressed: () => editor.chain().focus().toggleItalic().run(),
      icon: <LuItalic />,
    },
    {
      name: "bulletList",
      onPressed: () => editor.chain().focus().toggleBulletList().run(),
      icon: <LuList />,
    },
    {
      name: "orderedList",
      onPressed: () => editor.chain().focus().toggleOrderedList().run(),
      icon: <LuListOrdered />,
    },
  ];

  return (
    <div className="border border-input bg-transparent rounded-md w-fit">
      {buttons.map((button) => (
        <Toggle
          size={"sm"}
          pressed={editor.isActive(button.name)}
          onPressedChange={button.onPressed}
          key={button.name}
        >
          {React.cloneElement(button.icon, {
            className: "size-4",
          })}
        </Toggle>
      ))}
    </div>
  );
};
export default Toolbar;
