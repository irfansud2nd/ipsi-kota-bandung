import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Link from "@tiptap/extension-link";
import { useCallback } from "react";
import { toastError } from "@/lib/form/formFunctions";
import { Button } from "@/components/ui/button";

type Props = {
  text: string;
  onChange: (richText: string) => void;
};

const Tiptap = ({ text, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["https"],
      }),
    ],
    content: text,
    editorProps: {
      attributes: {
        class:
          "rounded-md border h-full border-input bg-background py-1 px-2 rich_text",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      toastError(e);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }
  return (
    <div className="grid grid-rows-[auto_auto_1fr] min-h-[300px] gap-y-1">
      <div className="flex items-center gap-x-2">
        <Toolbar editor={editor} />
        <Button
          onClick={setLink}
          className={editor.isActive("link") ? "is-active" : ""}
        >
          Set link
        </Button>
        <Button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
        >
          Unset link
        </Button>
      </div>
      <EditorContent editor={editor} className="min-h-[200px]" />
    </div>
  );
};
export default Tiptap;
