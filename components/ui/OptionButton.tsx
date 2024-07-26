import { FiMoreVertical } from "react-icons/fi";
import { Button } from "./button";

type Props = {
  asChild?: boolean;
};

const OptionButton = ({ asChild }: Props) => {
  return (
    <Button variant="outline" className="h-8 w-8 p-0" asChild={asChild}>
      <span className="sr-only">Open menu</span>
      <FiMoreVertical className="h-4 w-4" />
    </Button>
  );
};
export default OptionButton;
