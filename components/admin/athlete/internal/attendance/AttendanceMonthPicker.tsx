"use client";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const AttendanceMonthPicker = ({ month }: { month: string }) => {
  const router = useRouter();

  return (
    <Input
      type="month"
      name="month"
      defaultValue={month}
      onChange={(e) => {
        e.target.value && router.push(`attendance?month=${e.target.value}`);
      }}
      className="w-fit"
    />
  );
};
export default AttendanceMonthPicker;
