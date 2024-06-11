import { authOptions } from "@/lib/auth/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Admin",
};

const page = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="font-bold text-3xl">
        Hai {session?.user?.name || "Admin"}!
      </h1>
    </div>
  );
};
export default page;
