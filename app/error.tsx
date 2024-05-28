"use client";

import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="w-full h-full flex flex-col gap-2 justify-center items-center ">
      <div className="w-[450px] max-w-[90vw] grid grid-cols-2 items-center gap-5 ">
        <h1 className="font-bold text-xl sm:text-3xl">
          Maaf, ada kesalahan sistem yang terjadi
        </h1>
        <img
          src={"/images/error.png"}
          alt="not logged in"
          className="max-w-[50vw] w-[150px] sm:w-[250px]"
        />
      </div>
      <p className="text-muted-foreground">{error.message}</p>
      <div className="flex gap-2">
        <Button onClick={reset}>Coba lagi</Button>
        <Button asChild>
          <Link href={"/"}>Halaman Utama</Link>
        </Button>
      </div>
    </Container>
  );
};
export default Error;
