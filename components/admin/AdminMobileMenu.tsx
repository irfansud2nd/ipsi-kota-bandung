"use client";
import { usePathname } from "next/navigation";
import MobileMenuLinks from "../navbar/MobileMenuLinks";
import { useEffect, useState } from "react";
import { getAdminLinks } from "@/lib/admin/adminActions";

const AdminMobileMenu = () => {
  const [onAdmin, setOnAdmin] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [menu, setMenu] = useState<any>();
  const pathname = usePathname();

  useEffect(() => {
    setOnAdmin(pathname.includes("admin"));
  }, [pathname]);

  useEffect(() => {
    const getMenu = async () => {
      setFetched(true);
      const result = await getAdminLinks();
      setMenu(result);
    };
    if (!fetched) getMenu();
  }, [onAdmin]);

  return (
    <div className="mt-2 flex">
      <div className="border-y-2 py-1 flex flex-col items-center gap-1">
        <span className="border-t-2 w-full" />
        <h2 className="text-lg font-semibold whitespace-nowrap">ADMIN MENU</h2>
        <span className="border-t-2 w-full" />
      </div>
    </div>
  );
};
export default AdminMobileMenu;
