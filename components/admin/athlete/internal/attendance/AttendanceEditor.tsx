"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Attendance,
  AttendanceReport,
  AttendanceType,
  InternalAthleteRole,
  attendanceTypes,
} from "@/lib/athlete/internal/internalAthleteConstants";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  getAttendanceId,
  getAttendanceLabel,
  sendAttendance,
} from "@/lib/athlete/internal/internalAthleteFunctions";
import { toast } from "sonner";
import { toastError } from "@/lib/form/formFunctions";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getStartEndOfDay } from "@/lib/functions";

type Props = {
  data: AttendanceReport[];
  month: string;
  role: InternalAthleteRole;
};

const AttendanceEditor = ({ data, month, role }: Props) => {
  const [date, setDate] = useState(
    month + "-" + new Date().getDate().toString().padStart(2, "0")
  );
  const [report, setReport] = useState<AttendanceReport>();
  const [attendance, setAttendance] = useState<{
    id: string;
    date: number;
    type: AttendanceType;
  }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const checkRegisteredAttendance = () => {
    const attendance = report?.attendances.find(
      (item) => item.id == getAttendanceId(role, report.email, date)
    );

    console.log({ attendance });

    setAttendance(attendance);
  };

  useEffect(() => {
    checkRegisteredAttendance();
    console.log({ report });
  }, [report, date]);

  useEffect(() => {
    if (report?.name) setReport(data.find((item) => item.name == report.name));
  }, [data]);

  const handleSubmit = async () => {
    if (!attendance || !report || !date) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Menyimpan kehadiran");
    try {
      if (attendance.id) {
        await axios.patch("/api/attendance", {
          id: attendance.id,
          type: attendance.type,
        });
      } else {
        const formattedDate = new Date(date).getTime();

        const data: Attendance = {
          id: getAttendanceId(role, report.email, formattedDate),
          email: report.email,
          date: formattedDate,
          type: attendance.type,
          role,
        };
        await axios.post("/api/attendance", data);
      }
      setIsSubmitting(false);
      toast.success("Kehadiran berhasil disimpan", { id: toastId });
      router.refresh();
    } catch (error) {
      toastError(error, toastId);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const toastId = toast.loading("Menghapus kehadiran");
    try {
      if (!attendance?.id)
        throw { messsage: "Tidak ada kehadiran yang dipilih" };
      await axios.delete(`/api/attendance?id=${attendance.id}`);
      toast.success("Kehadirean berhasil dihapus", { id: toastId });
      router.refresh();
    } catch (error) {
      toastError(error, toastId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="w-[300px] flex flex-col gap-2">
        <Label>Tanggal</Label>
        <Input
          value={date}
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />
        <Label>Nama</Label>
        <Select
          value={report ? report.name : ""}
          onValueChange={(value) =>
            setReport(data.find((item) => item.name == value))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {data.map((item) => (
              <SelectItem value={item.name} key={item.email}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Label>Tipe Kehadiran</Label>
        <Select
          value={attendance ? attendance.type : ""}
          onValueChange={(value: AttendanceType) =>
            setAttendance((prev) =>
              prev ? { ...prev, type: value } : { id: "", date: 0, type: value }
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {attendanceTypes.map((item) => (
              <SelectItem value={item}>{getAttendanceLabel(item)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 justify-end">
          <Button
            onClick={handleDelete}
            variant={"destructive"}
            disabled={!attendance?.id || isSubmitting}
          >
            Hapus
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!attendance || !report || !date || isSubmitting}
          >
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AttendanceEditor;
