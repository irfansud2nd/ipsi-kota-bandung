import { Bank } from "@/lib/event/eventConstants";

type Props = {
  bank: Bank;
  className?: string;
};

const BankLogo = ({ bank, className }: Props) => {
  return <img src={`/images/banks/${bank}.png`} className={className} />;
};
export default BankLogo;
