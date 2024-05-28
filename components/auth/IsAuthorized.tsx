"use client";

import { SpecialUserRole } from "@/lib/admin/adminConstants";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PageInfo from "../ui/PageInfo";
import Loading from "../ui/Loading";
import { usePathname } from "next/navigation";
import { getPermittedRoles, isPermitted } from "@/lib/admin/adminFunctions";
import { decode } from "jsonwebtoken";
import { isAuthorized } from "@/lib/admin/adminActions";

type Props = {
  children: React.ReactNode;
};

const IsAuthorized = ({ children }: Props) => {
  const [sessionUpdated, setSessionUpdated] = useState(false);

  const { data: session, update } = useSession();
  const updatedSesssion: any = session;
  const authorizedToken = updatedSesssion?.user?.authorizedToken;

  const email = session?.user?.email;

  const pathname = usePathname();

  useEffect(() => {
    if (email && !sessionUpdated) getToken();
  }, []);

  const getToken = async () => {
    const { roles, token, name, image } = await isAuthorized({
      ignoreJwt: true,
    });
    if (roles.length) {
      await update({
        ...session,
        user: {
          ...session?.user,
          name: name ?? session?.user?.name,
          authorizedToken: token,
          image: image ? image.downloadUrl : session?.user?.image,
        },
      });
    }
    setSessionUpdated(true);
  };

  if (!email) return <PageInfo type="notLoggedIn" />;

  if (!sessionUpdated) return <Loading full text="Memeriksa Akses" />;

  const roles = authorizedToken
    ? (
        decode(authorizedToken) as {
          roles: SpecialUserRole[];
        }
      ).roles
    : [];

  if (!isPermitted(roles, getPermittedRoles(pathname)))
    return <PageInfo type="notAuthorized" />;

  return <>{children}</>;
};
export default IsAuthorized;
