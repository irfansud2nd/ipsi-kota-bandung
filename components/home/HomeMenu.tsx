import { IoBusiness } from "react-icons/io5";
import HomeMenuItem from "./HomeMenuItem";
import Container from "../ui/Container";
import { MdEventAvailable } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa6";
import { IoMdTrophy } from "react-icons/io";

const HomeMenu = () => {
  const menus = [
    {
      label: "Profil",
      icon: <IoBusiness />,
      href: "profile",
    },
    {
      label: "Berita",
      icon: <FaRegNewspaper />,
      href: "news",
    },
    {
      label: "Event",
      icon: <MdEventAvailable />,
      href: "event",
    },
    {
      label: "Kejuaraan",
      icon: <IoMdTrophy />,
      href: "championship",
    },
  ];
  return (
    <Container className="h-fit mb-10 px-5 md:px-10">
      <div className="bg-muted rounded-3xl grid grid-cols-2 sm:grid-cols-4 py-5 gap-y-5 place-items-center overflow-y-hidden">
        {menus.map((menu, i) => (
          <HomeMenuItem {...menu} delay={i * 300} key={menu.href} />
        ))}
      </div>
    </Container>
  );
};
export default HomeMenu;
