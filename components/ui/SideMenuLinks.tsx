import { GroupedLinks, Links } from "@/lib/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { SheetClose } from "../ui/sheet";
import Link from "next/link";

type Props = {
  menu: {
    links: Links;
    groupedLinks: GroupedLinks;
  };
  className?: string;
  onSheet?: boolean;
  prefix?: string;
};

const SideMenuLinks = ({ menu, className, onSheet, prefix }: Props) => {
  return (
    <div className={className}>
      {menu.links.map((link) =>
        onSheet ? (
          <SheetClose asChild key={link.href}>
            <Link href={(prefix || "") + link.href} className="border-b">
              {link.label}
            </Link>
          </SheetClose>
        ) : (
          <Link href={(prefix || "") + link.href} className="border-b">
            {link.label}
          </Link>
        )
      )}
      <Accordion type="single" collapsible>
        {menu.groupedLinks.map((item) => (
          <AccordionItem value={item.title} key={item.title}>
            <AccordionTrigger className="py-0 px-0 text-base transition font-normal text-start">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col ml-1 pb-1 last:border-b-0">
              {item.links.map((link, i) =>
                onSheet ? (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={(prefix || "") + item.prefix + link.href}
                      key={link.href}
                      className={`${
                        i < item.links.length - 1 && "border-b"
                      } py-1`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ) : (
                  <Link
                    href={(prefix || "") + item.prefix + link.href}
                    key={link.href}
                    className={`${
                      i < item.links.length - 1 && "border-b"
                    } py-1`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
export default SideMenuLinks;
