"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

const LoginButton = () => {
  return (
    <Button
      className="flex items-center gap-1"
      variant={"secondary"}
      onClick={() => signIn("google")}
    >
      Login menggunakan Google
      <FcGoogle className="size-6" />
    </Button>
  );
};
export default LoginButton;
