import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";

type Props = {
  text: string;
  onChange: (richText: string) => void;
};

const Tiptap = ({ text, onChange }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
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
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-[300px]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
export default Tiptap;
