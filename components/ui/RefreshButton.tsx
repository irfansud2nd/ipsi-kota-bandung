"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
type Props = {
  text?: string;
  className?: string;
};

const RefreshButton = ({ text, className }: Props) => {
  const router = useRouter();
  return (
    <Button onClick={() => router.refresh()} className={className}>
      {text ?? "Refresh"}
    </Button>
  );
};
export default RefreshButton;
