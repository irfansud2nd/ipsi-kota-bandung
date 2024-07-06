import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IoMenuSharp } from "react-icons/io5";
import { Button } from "../ui/button";
import ProfileButton from "./ProfileButton";
import SideMenuLinks from "../ui/SideMenuLinks";
import { getAdminLinks } from "@/lib/admin/adminActions";
import { clientLinks } from "@/lib/constants";
import ChampionshipMenuAdmin from "../admin/ChampionshipMenuAdmin";

const MobileMenu = async () => {
  const adminLinks = await getAdminLinks();

  const showAdminMenu =
    adminLinks.links.filter((item) => item.restricted == true).length > 0;
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button variant={"outline"} size={"icon"}>
          <IoMenuSharp className="text-2xl" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-fit min-w-40 lg:hidden">
        <ProfileButton mobile />
        <SideMenuLinks className="flex flex-col gap-1" menu={clientLinks} />
        {showAdminMenu && (
          <div className="mt-2">
            <div className="border-y-2 py-1 flex items-center gap-1">
              <span className="border-t-2 w-full" />
              <h2 className="text-lg font-semibold whitespace-nowrap">
                ADMIN MENU
              </h2>
              <span className="border-t-2 w-full" />
            </div>
            <SideMenuLinks
              className="flex flex-col gap-1"
              menu={adminLinks}
              onSheet
            />
            <ChampionshipMenuAdmin onSheet />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
export default MobileMenu;
