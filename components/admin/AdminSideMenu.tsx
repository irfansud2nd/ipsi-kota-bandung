import { getAdminLinks } from "@/lib/admin/adminActions";
import SideMenuLinks from "../ui/SideMenuLinks";
import ChampionshipMenuAdmin from "./ChampionshipMenuAdmin";

const AdminSideMenu = async () => {
  const adminLinks = await getAdminLinks();

  return (
    <div className="border-r-2 h-full p-2 relative">
      <SideMenuLinks className="flex flex-col" menu={adminLinks} />
      <ChampionshipMenuAdmin />
    </div>
  );
};
export default AdminSideMenu;
