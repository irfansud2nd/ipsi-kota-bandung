import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IoMenuSharp } from "react-icons/io5";
import { Button } from "../ui/button";
import ProfileButton from "./ProfileButton";
import MobileMenuLinks from "./MobileMenuLinks";

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button variant={"outline"} size={"icon"}>
          <IoMenuSharp className="text-2xl" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-fit min-w-40 lg:hidden">
        <ProfileButton mobile />
        <MobileMenuLinks />
      </SheetContent>
    </Sheet>
  );
};
export default MobileMenu;
