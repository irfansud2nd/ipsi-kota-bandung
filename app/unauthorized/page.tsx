"use client";
import PageInfo from "@/components/ui/PageInfo";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const page = ({ searchParams }: { searchParams: { to: string } }) => {
  const { to } = searchParams;
  const router = useRouter();
  useEffect(() => {
    toast.info("Anda akan dialihkan dalam beberapa saat", { duration: 2000 });
    setTimeout(() => {
      router.push(to ? decodeURIComponent(to) : "/");
    }, 3000);
  }, []);
  return <PageInfo type="notAuthorized" />;
};
export default page;
