import Link from "next/link";
import ProfileButton from "./ProfileButton";
import Container from "../ui/Container";
import MobileMenu from "./MobileMenu";
import { clientLinks } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdArrowDropDown } from "react-icons/md";

const Navbar = () => {
  const { links, groupedLinks } = clientLinks;
  return (
    <nav className="h-[50px] sm:h-[70px] w-full fixed top-0 z-50 bg-white">
      <Container className="flex items-center px-3 h-full gap-3">
        <Link href={"/"} className="flex h-full items-center mr-auto">
          <img
            src={"/images/logo-ipsi-bandung.png"}
            alt="logo ipsi"
            className=" h-[30px] sm:h-[50px] aspect-square transition-all"
          />
          <div className="flex flex-col justify-around whitespace-nowrap border-l-2 border-foreground ml-2 pl-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold transition">
              <span className="max-sm:hidden">
                Ikatan Pencak Silat Indonesia
              </span>
              <span className="sm:hidden">IPSI Kota Bandung</span>
            </h1>
            <h2 className="max-sm:hidden text-xl font-semibold">
              Kota Bandung
            </h2>
          </div>
        </Link>
        <div className="flex gap-3 items-center max-lg:hidden">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              // COLOR_CHANGE
              // className="text-lg font-medium hover:-translate-y-1 hover:border-b-2 border-green-400 transition-all"
              className="text-lg font-medium hover:-translate-y-1 hover:border-b-2 border-[#419EBD] transition-all"
            >
              {link.label}
            </Link>
          ))}
          {groupedLinks.map((item) => (
            <DropdownMenu key={item.title}>
              <DropdownMenuTrigger className="flex gap-1 items-center text-lg font-medium data-[state=open]:-translate-y-1 hover:-translate-y-1 data-[state=open]:border-b-2 hover:border-b-2 border-green-400 transition-all focus:outline-none">
                {item.title}
                <MdArrowDropDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {item.links.map((link) => (
                  <DropdownMenuItem asChild key={link.href}>
                    <Link href={item.prefix + link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>
        <ProfileButton className="max-lg:hidden" />
        <MobileMenu />
      </Container>
      <div className="w-full h-1 bg-gradient-to-r gradient_colors" />
    </nav>
  );
};
export default Navbar;
