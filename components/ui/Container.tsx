import { HtmlHTMLAttributes } from "react";

const Container = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div className={`max-w-[1440px] mx-auto w-full ${className}`} style={style}>
      {children}
    </div>
  );
};
export default Container;
