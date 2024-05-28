import PageInfo from "@/components/ui/PageInfo";
import image from "@/public/images/not_found.png";
type Props = {
  text?: string;
};
const NotFound = ({ text }: Props) => {
  return <PageInfo type="notFound" />;
};
export default NotFound;
