import { getServerSession } from "next-auth";
import PageInfo from "../ui/PageInfo";
import { authOptions } from "@/lib/auth/authOptions";

type Props = { children: React.ReactNode; exception?: string[] };

const IsLoggedIn = async ({ children, exception }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return <PageInfo type="notLoggedIn" />;
  return <>{children}</>;
};
export default IsLoggedIn;
