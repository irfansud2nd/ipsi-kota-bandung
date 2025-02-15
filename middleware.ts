import { NextRequest, NextResponse } from "next/server";
import {
  SpecialUserRole,
  roleAccess,
  specialUserRoles,
} from "./lib/admin/adminConstants";
import {
  InternalAthleteRole,
  internalAthleteRoles,
} from "./lib/athlete/internal/internalAthleteConstants";
import { getAdminServerSession } from "./lib/admin/adminSession";

const getPermittedRoles = (dir: string) => {
  let roles: SpecialUserRole[] = [];
  if (dir == "/") return roles;

  const isAdminRoutes = dir.startsWith("/admin");
  const isInternalAthleteRoutes =
    dir.startsWith("/athlete") && dir.includes("/restricted");

  if (!isAdminRoutes && !isInternalAthleteRoutes) return roles;

  // RESTRICTED
  roles.push("master");

  // INTERNAL ATHLETE ONLY
  if (isInternalAthleteRoutes) {
    roles.push(dir.split("/")[2] as InternalAthleteRole);
    return roles;
  }

  // ADMIN ROUTES
  if (dir == "/admin") {
    roles = specialUserRoles.filter(
      (item) => !internalAthleteRoles.includes(item as InternalAthleteRole)
    );
    return roles;
  }

  roleAccess.map((access) => {
    if (access.dir.some((item) => dir.includes(item))) {
      roles.push(access.role);
    }
  });

  if (dir.includes("/championship")) {
    roles = roles.filter((item) => item !== "admin");
  }

  return roles;
};

const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;

  const permittedRoles = getPermittedRoles(path);

  if (permittedRoles.length) {
    const adminSession = await getAdminServerSession();
    // console.log({ permittedRoles, adminSession });
    if (!adminSession) {
      // REDIRECT TO IS AUTHORIZED
      return NextResponse.redirect(
        new URL(`/is-authorized?from=${path}`, req.nextUrl)
      );
    } else {
      if (!adminSession.roles?.some((role) => permittedRoles.includes(role))) {
        // REDIRECT TO UNAUTHORIZED
        return NextResponse.redirect(
          new URL("/unauthorized?to=/admin", req.nextUrl)
        );
      }
    }
  }

  return NextResponse.next();
};

export default middleware;
