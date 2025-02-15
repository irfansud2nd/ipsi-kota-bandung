"use client";
import Loading from "@/components/ui/Loading";
import PageInfo from "@/components/ui/PageInfo";
import { fetchUserRoles } from "@/lib/admin/adminAuthActions";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

const page = ({ searchParams }: { searchParams: { from: string } }) => {
  const { from } = searchParams;
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    const check = async () => {
      const isSpecialUser = await fetchUserRoles();
      const url = isSpecialUser
        ? from
          ? decodeURIComponent(from)
          : "/admin"
        : "/unauthorized?to=/";

      router.push(url);
    };

    if (session.data?.user) check();
  }, []);

  if (!session.data?.user) return <PageInfo type="notLoggedIn" />;

  return (
    <div className="w-full h-full">
      <Loading full text="Memeriksa akses" />
    </div>
  );
};
export default page;
