"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { setSideMenu } from "@/lib/redux/championship/championshipMenuSlice";
import { RootState } from "@/lib/redux/store";
import { MdClose, MdMenu } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  onSideMenu?: boolean;
};

const ChampionshipMenuButton = ({ onSideMenu }: Props) => {
  const show = useSelector((state: RootState) => state.sideMenu.normal);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center">
      {onSideMenu && (
        <p
          className={`transition-all flex-1 text-center font-semibold 
          ${!show && "text-[0]"}`}
        >
          Menu
        </p>
      )}
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={`rounded p-2 bg-gray-100 hover:bg-primary w-fit text-black transition-all 
            ${onSideMenu ? "" : "mr-2 md:hidden"}`}
              onClick={() => dispatch(setSideMenu(!show))}
            >
              <MdMenu
                className={`transition-all
                ${show ? "rotate-180 size-0" : "size-6"}`}
              />
              <MdClose
                className={`transition-all
                ${show ? "size-6" : "rotate-180 size-0"}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="z-[99] hidden">
            <p>{show ? "Tutup Menu" : "Buka Menu"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
export default ChampionshipMenuButton;
