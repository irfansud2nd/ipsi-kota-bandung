import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin",
};

const page = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="font-bold text-3xl">Hai Admin!</h1>
    </div>
  );
};
export default page;
