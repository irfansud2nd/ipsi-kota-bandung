import Link from "next/link";
import React from "react";

type Props = {
  icon: JSX.Element;
  label: string;
  href: string;
  delay: number;
};
const HomeMenuItem = ({ icon, label, href, delay }: Props) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-100 hover:scale-110 transition-all size-36 md:size-40 animate__animated animate__bounceInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      {React.cloneElement(icon, {
        className: "size-16 md:size-20",
      })}
      <span className="font-semibold text-lg md:text-xl">{label}</span>
    </Link>
  );
};
export default HomeMenuItem;
