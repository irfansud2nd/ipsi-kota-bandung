"use server";
import { GroupedLinks, Links, clientLinks } from "@/lib/constants";
import React, { isValidElement } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { SheetClose } from "../ui/sheet";
import Link from "next/link";
import { getAdminLinks } from "@/lib/admin/adminActions";

const LinksComp = ({
  menu,
}: {
  menu: { links: Links; groupedLinks: GroupedLinks };
}) => {
  return (
    <div className="flex flex-col gap-1">
      {menu.links.map((link) => (
        <SheetClose asChild key={link.href}>
          <Link href={link.href} className="border-b">
            {link.label}
          </Link>
        </SheetClose>
      ))}
      <Accordion type="single" collapsible>
        {menu.groupedLinks.map((item) => (
          <AccordionItem value={item.title} key={item.title}>
            <AccordionTrigger className="py-0 px-0 text-base transition font-normal">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col ml-1 pb-1">
              {item.links.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={item.prefix + link.href}
                    key={link.href}
                    className="border-b py-1"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

const MobileMenuLinks = async () => {
  const adminMenu = await getAdminLinks();

  const showAdminMenu =
    adminMenu.links.filter((item) => item.restricted == true).length > 0;

  return (
    <>
      <LinksComp menu={clientLinks} />
      {showAdminMenu && (
        <div className="mt-2">
          <div className="border-y-2 py-1 flex items-center gap-1">
            <span className="border-t-2 w-full" />
            <h2 className="text-lg font-semibold whitespace-nowrap">
              ADMIN MENU
            </h2>
            <span className="border-t-2 w-full" />
          </div>
          <LinksComp menu={adminMenu} />
        </div>
      )}
    </>
  );
};
export default MobileMenuLinks;
