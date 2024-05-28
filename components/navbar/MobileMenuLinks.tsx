import { GroupedLinks, Links } from "@/lib/constants";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { SheetClose } from "../ui/sheet";
import Link from "next/link";
type Props = {
  links: Links;
  groupedLinks: GroupedLinks;
};
const MobileMenuLinks = ({ links, groupedLinks }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      {links.map((link) => (
        <SheetClose asChild key={link.href}>
          <Link href={link.href} className="border-b">
            {link.label}
          </Link>
        </SheetClose>
      ))}
      <Accordion type="single" collapsible>
        {groupedLinks.map((item) => (
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
