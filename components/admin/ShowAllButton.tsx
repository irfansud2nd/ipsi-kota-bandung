import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  showAll: boolean;
  href: string;
};

const ShowAllButton = ({ showAll, href }: Props) => {
  return (
    <Button asChild className={`${showAll && "hidden"}`}>
      <Link href={`${href}?showAll=true`}>Tampilkan Semua</Link>
    </Button>
  );
};
export default ShowAllButton;
