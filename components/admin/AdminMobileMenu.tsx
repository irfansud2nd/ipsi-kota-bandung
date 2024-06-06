"use client";

import { usePathname } from "next/navigation";
import MobileMenuLinks from "../navbar/MobileMenuLinks";

const AdminMobileMenu = () => {
  const onAdmin = usePathname().includes("admin");

  if (!onAdmin) return <></>;

  return (
    <div className="mt-2">
      <div className="border-y-2 py-1 flex items-center gap-1">
        <span className="border-t-2 w-full" />
        <h2 className="text-lg font-semibold whitespace-nowrap">ADMIN MENU</h2>
        <span className="border-t-2 w-full" />
      </div>
      <MobileMenuLinks onAdmin />
    </div>
  );
};
export default AdminMobileMenu;
