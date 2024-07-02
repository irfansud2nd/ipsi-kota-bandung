import { formatDate } from "@/lib/functions";
import {
  Attendance,
  AttendanceToken,
  AttendanceType,
  InternalAthleteRole,
  internalAthleteRoles,
} from "./internalAthleteConstants";
import { v5 } from "uuid";
import { createHash } from "crypto";
import { addAttendanceSql, getAttendanceToken } from "./internalAthleteActions";

export const isInternalAthleteRole = (role: InternalAthleteRole) => {
  return internalAthleteRoles.includes(role);
};

export const getAttendanceId = (
  role: InternalAthleteRole,
  email: string = "",
  date: string | number = Date.now()
) => {
  const jsonString = JSON.stringify({
    date: formatDate(date, { htmlFormat: true, withoutHour: true }),
    email,
    role,
  });

  const hash = createHash("sha1").update(jsonString).digest("hex");
  const uuid = v5(hash, "a2a6e0f7-15d6-4894-96a6-474b040a24f0");
  return uuid;
};

export const sendAttendance = async (
  tokenString: string,
  email: string,
  role: InternalAthleteRole,
  type: AttendanceType
) => {
  try {
    const data: Attendance = {
      id: getAttendanceId(role, email),
      email,
      type,
      date: Date.now(),
      role,
    };
    const { result: token, error: tokenError } = await getAttendanceToken(role);
    if (tokenError) throw tokenError;

    if (!token || token.token != tokenString)
      throw {
        message: "QR Code tidak tidak sesuai",
        code: "invalid-qr-code",
      };

    if (!token.status)
      throw {
        message: "Status QR Code tidak aktif",
        code: "invalid-qr-code",
      };

    const { error } = await addAttendanceSql(data);
    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

export const getDaysInMonth = (month: string) => {
  let date = new Date(month);
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  const days = date.getDate();
  let result: number[] = [];
  for (let i = 1; i <= days; i++) {
    result.push(i);
  }
  return result;
};

export const getAttendanceLabel = (type: AttendanceType | "") => {
  let text = "";
  switch (type) {
    case "present":
      text = "Hadir";
      break;
    case "negligent":
      text = "Alpa";
      break;
    case "leave":
      text = "Izin";
      break;
    case "sick":
      text = "Sakit";
      break;
  }
  return text;
};
