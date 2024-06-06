import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAdminLinks } from "@/lib/admin/adminActions";

const AdminSideMenu = async () => {
  const { links, groupedLinks } = await getAdminLinks();

  return (
    <div className="p-2 flex flex-col border-r-2 h-full">
      {links.map((link) => (
        // (!link.restricted ||
        //   isPermitted(roles, getPermittedRoles(link.href))) &&
        <Link
          href={link.href}
          key={link.href}
          className="font-medium border-b hover:bg-muted transition p-1 rounded-sm"
        >
          {link.label}
        </Link>
      ))}
      <Accordion type="single" collapsible>
        {groupedLinks.map((item) => (
          // isPermitted(roles, getPermittedRoles(item.prefix)) &&
          <AccordionItem value={item.title} key={item.title}>
            <AccordionTrigger className="py-0 text-base hover:bg-muted transition p-1 rounded-sm">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col ml-1 pb-1">
              {item.links.map((link) => (
                <Link
                  href={item.prefix + link.href}
                  key={link.href}
                  className="hover:bg-muted transition p-1 rounded-sm"
                >
                  {link.label}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
export default AdminSideMenu;
