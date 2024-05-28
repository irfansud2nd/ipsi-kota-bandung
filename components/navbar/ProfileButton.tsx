"use client";
import { FaRegUser } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { signIn, signOut, useSession } from "next-auth/react";

const LoginButton = ({ className }: { className?: string }) => {
  return (
    <Button
      variant={"outline"}
      onClick={() => signIn("google")}
      className={className}
    >
      Login
    </Button>
  );
};

const ProfileButton = ({
  className,
  mobile,
}: {
  className?: string;
  mobile?: boolean;
}) => {
  const session = useSession();
  if (mobile) {
    return (
      <div className="flex gap-2 items-center border-b pb-1 mb-1">
        {session?.data?.user?.email ? (
          <>
            <Avatar className="hover:brightness-110 transition">
              <AvatarImage
                src={session.data.user.image || ""}
                alt={session.data.user.name || ""}
              />
              <AvatarFallback>
                <FaRegUser />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{session.data.user.email}</p>
              <Button size={"sm"} variant={"outline"} onClick={() => signOut()}>
                Logout
              </Button>
            </div>
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    );
  }

  if (!session?.data?.user?.email) return <LoginButton className={className} />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className}>
        <Avatar className="hover:brightness-110 transition">
          <AvatarImage src={session.data.user.image || ""} alt="@shadcn" />
          <AvatarFallback>
            <FaRegUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={className}>
        <DropdownMenuLabel>{session.data.user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileButton;
