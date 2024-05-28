type Props = {
  text: string;
  fallback: string;
  className?: string;
};

const RichTextDisplay = ({ text, fallback, className }: Props) => {
  return (
    <div
      className={`rich_text ${className}`}
      dangerouslySetInnerHTML={{
        __html: text.length ? text : fallback,
      }}
    />
  );
};
export default RichTextDisplay;
