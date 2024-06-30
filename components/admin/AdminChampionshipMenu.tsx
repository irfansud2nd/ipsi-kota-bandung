"use client";

import { getChampionship } from "@/lib/event/eventFunctions";
import { usePathname } from "next/navigation";
import SideMenuLinks from "../ui/SideMenuLinks";
import { championshipAdminLinks } from "@/lib/admin/adminConstants";
import Link from "next/link";

const AdminChampionshipMenu = ({ onSheet }: { onSheet?: boolean }) => {
  const pathname = usePathname().split("/");

  if (pathname.includes("championship") && pathname.includes("admin")) {
    const championshipId = pathname[3];
    const championship = getChampionship(championshipId);
    if (!championship) return null;
    return (
      <div className="h-full absolute top-0 left-0 pt-[140px] lg:pt-2 w-full px-6 lg:px-2">
        <div className="bg-white h-full">
          <Link href={"/admin"}>Dashboard</Link>
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
            onSheet={onSheet}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};
export default AdminChampionshipMenu;
