"use client";
import { MdGroups2, MdOutlineSportsMartialArts } from "react-icons/md";
import { FaFistRaised, FaThList, FaUser } from "react-icons/fa";
import { FaHandHoldingHand, FaMedal, FaMoneyBill1Wave } from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import ChampionshipMenuButton from "./ChampionshipMenuButton";
import { setSideMenu } from "@/lib/redux/championship/championshipMenuSlice";

export const MenuButton = () => {
  return <p>test</p>;
};

const ChampionshipMenu = () => {
  const show = useSelector((state: RootState) => state.sideMenu.normal);

  const pathname = usePathname();
  const dispatch = useDispatch();

  const menus = [
    {
      label: "Kontingen",
      href: "contingent",
      icon: <MdGroups2 />,
    },
    {
      label: "Atlet",
      href: "athlete",
      icon: <MdOutlineSportsMartialArts />,
      length: 0,
    },
    {
      label: "Official",
      href: "official",
      icon: <FaUser />,
      length: 0,
    },
    {
      label: "Kategori Tanding",
      href: "fight",
      icon: <FaFistRaised />,
      length: 0,
    },
    {
      label: "Kategori Seni",
      href: "art",
      icon: <FaHandHoldingHand />,
      length: 0,
    },

    {
      label: "Pembayaran",
      href: "payment",
      icon: <FaMoneyBill1Wave />,
    },
    {
      label: "Jadwal Pertandingan",
      href: "schedule",
      icon: <FaThList />,
    },
    // {
    //   label: "Perolehan Medali",
    //   href: "medal",
    //   icon: <FaMedal />,
    // },
  ];

  return (
    <div
      className={`bg-gray-200 w-fit h-fit mr-0 mt-2 rounded-md md:top-[80px] p-2 flex flex-col gap-3 fixed md:sticky transition-all z-10 
      ${show ? "left-2 mr-2" : "-left-full"}`}
    >
      <ChampionshipMenuButton onSideMenu />
      {menus.map((menu) => (
        <TooltipProvider key={menu.href} delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`${menu.href}`}
                className={`rounded p-2 bg-gray-100 hover:bg-primary transition-all flex items-center
                ${show && "justify-center"}
                ${pathname.includes(menu.href) && "bg-primary"}`}
                onClick={() =>
                  window.innerWidth <= 768 && dispatch(setSideMenu(false))
                }
              >
                <span className={`*:size-6 ${show && "mr-2"}`}>
                  {menu.icon}
                </span>
                <span
                  className={`transition-all whitespace-nowrap flex-1 ${
                    !show && "text-[0]"
                  }`}
                >
                  {menu.label}
                </span>
                <span>{menu.length && show ? menu.length : null}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent className={`${show && "hidden"}`}>
              <p>{menu.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
export default ChampionshipMenu;
