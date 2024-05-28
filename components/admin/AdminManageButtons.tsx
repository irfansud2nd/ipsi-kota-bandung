import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdEdit, MdOutlineDeleteForever } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

type Show = {
  label: string;
  url?: string;
  component?: JSX.Element;
};

type Edit = {
  url?: string;
  component?: JSX.Element;
};

type Props = {
  show?: Show;
  edit?: Edit;
  handleDelete: () => void;
};

export const ShowButton = ({ label, url, component }: Show) => {
  const button = (
    <Button variant={"outline"} size={"icon"} asChild>
      <TooltipTrigger>
        {url ? (
          <Link href={url} target="_blank">
            <FaExternalLinkAlt />
          </Link>
        ) : (
          <FaExternalLinkAlt />
        )}
      </TooltipTrigger>
    </Button>
  );
  return (
    <TooltipProvider>
      <Tooltip>
        {component ? (
          <Dialog>
            <DialogTrigger asChild>{button}</DialogTrigger>
            <DialogContent className="pt-10 w-fit">{component}</DialogContent>
          </Dialog>
        ) : (
          button
        )}
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const EditButton = ({ url, component }: Edit) => {
  const button = (
    <Button variant={"outline"} size={"icon"} asChild>
      <TooltipTrigger>
        {url ? (
          <Link href={url}>
            <MdEdit />
          </Link>
        ) : (
          <MdEdit />
        )}
      </TooltipTrigger>
    </Button>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        {component ? (
          <Dialog>
            <DialogTrigger asChild>{button}</DialogTrigger>
            <DialogContent className="pt-10 w-fit">{component}</DialogContent>
          </Dialog>
        ) : (
          button
        )}
        <TooltipContent>
          <p>Ubah</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const AdminManageButtons = ({ show, edit, handleDelete }: Props) => {
  return (
    <div className="flex gap-1">
      {/* SHOW */}
      {show && <ShowButton {...show} />}
      {/* EDIT */}
      {edit && <EditButton {...edit} />}
      {/* DELETE */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"outline"} size={"icon"} onClick={handleDelete}>
              <MdOutlineDeleteForever />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
export default AdminManageButtons;
