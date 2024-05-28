"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { GroupedLinks } from "@/lib/constants";
import Link from "next/link";

const NavMenu = ({ groupedLinks }: { groupedLinks: GroupedLinks }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {groupedLinks.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuTrigger className="text-lg font-medium hover:-translate-y-1 hover:border-b-2 data-[state=open]:border-b-2 border-green-400 transition-all focus:bg-transparent data-[state=open]:bg-transparent data-[active]:bg-transparent hover:bg-transparent px-0 rounded-none">
              {item.title}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-full">
              {item.links.map((link) => (
                <Link
                  href={item.prefix + link.href}
                  key={link.href}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} min-w-full w-full`}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </Link>
              ))}
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
export default NavMenu;
