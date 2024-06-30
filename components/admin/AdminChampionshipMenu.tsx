"use client";

import { getChampionship } from "@/lib/event/eventFunctions";
import { usePathname } from "next/navigation";
import SideMenuLinks from "../ui/SideMenuLinks";
import { championshipAdminLinks } from "@/lib/admin/adminConstants";
import Link from "next/link";

const AdminChampionshipMenu = () => {
  const pathname = usePathname().split("/");

  if (pathname.includes("championship") && pathname.includes("admin")) {
    const championshipId = pathname[3];
    const championship = getChampionship(championshipId);
    if (!championship) return null;
    return (
      <div className="h-full absolute top-0 pt-40 lg:pt-8 lg:max-w-[200px] flex">
        <div className="bg-white">
          <div className="border-y-2">
            <Link
              href={"/admin/championship/championshipId"}
              className=" font-medium"
            >
              {championship.title}
            </Link>
          </div>
          <SideMenuLinks
            className="flex flex-col"
            prefix={`/admin/championship/${championshipId}/`}
            menu={championshipAdminLinks}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};
export default AdminChampionshipMenu;
