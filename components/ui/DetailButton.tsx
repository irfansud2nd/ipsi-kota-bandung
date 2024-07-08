import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdMoreHoriz } from "react-icons/md";

const DetailButton = ({ href }: { href: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={"icon"} variant={"outline"} asChild>
            <Link href={href}>
              <MdMoreHoriz className="size-4" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Detail</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default DetailButton;
