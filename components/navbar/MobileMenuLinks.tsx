"use server";
import { GroupedLinks, Links, clientLinks } from "@/lib/constants";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { SheetClose } from "../ui/sheet";
import Link from "next/link";
import { isAuthorized } from "@/lib/admin/adminActions";
import { adminLinks } from "@/lib/admin/adminConstants";
type Props = {
  onAdmin?: boolean;
};
const MobileMenuLinks = async ({ onAdmin }: Props) => {
  let menu: {
    links: Links;
    groupedLinks: GroupedLinks;
  } = {
    links: [],
    groupedLinks: [],
  };

  if (onAdmin) {
    const { roles } = await isAuthorized();
    menu = adminLinks(roles);
  } else {
    menu = clientLinks;
  }

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
export default MobileMenuLinks;
