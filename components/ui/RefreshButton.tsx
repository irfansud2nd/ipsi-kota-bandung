"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";

const RefreshButton = () => {
  const router = useRouter();
  return <Button onClick={() => router.refresh()}>Refresh</Button>;
};
export default RefreshButton;
