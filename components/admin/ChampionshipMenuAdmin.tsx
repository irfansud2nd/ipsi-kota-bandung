"use client";

import { getChampionship } from "@/lib/event/eventFunctions";
import { usePathname } from "next/navigation";
import SideMenuLinks from "../ui/SideMenuLinks";
import { championshipAdminLinks } from "@/lib/admin/adminConstants";
import Link from "next/link";

const ChampionshipMenuAdmin = ({
  onSheet,
  onPage,
}: {
  onSheet?: boolean;
  onPage?: boolean;
}) => {
  const pathname = usePathname().split("/");

  if (pathname.includes("championship") && pathname.includes("admin")) {
    const championshipId = pathname[3];
    const championship = getChampionship(championshipId);
    if (!championship) return null;
    return (
      <div
        className={`w-full lg:px-2 ${
          onPage
            ? "lg:hidden"
            : "h-full absolute top-0 left-0 pt-[140px] lg:pt-2 px-6"
        }`}
      >
        <div className="bg-white h-full">
          {!onPage && (
            <>
              <Link href={"/admin"}>Dashboard</Link>
              <div className="border-y-2">
                <Link
                  href={`/admin/championship/${championshipId}`}
                  className=" font-medium"
                >
                  {championship.title}
                </Link>
              </div>
            </>
          )}
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
export default ChampionshipMenuAdmin;
