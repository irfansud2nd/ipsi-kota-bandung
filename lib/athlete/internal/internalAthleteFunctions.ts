import { formatDate, getStartEndOfDay } from "@/lib/functions";
import {
  Attendance,
  AttendanceToken,
  AttendanceType,
  InternalAthleteRole,
  internalAthleteRoles,
} from "./internalAthleteConstants";
import axios from "axios";
import { v4, v5 } from "uuid";
import { createHash } from "crypto";

export const isInternalAthleteRole = (role: InternalAthleteRole) => {
  return internalAthleteRoles.includes(role);
};

export const getAttendanceToken = async (role: InternalAthleteRole) => {
  try {
    const res = await axios.get(`/api/attendance/token?role=${role}`);

    return res.data.result;
  } catch (error) {
    throw error;
  }
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

export const generateAttendanceToken = async (role: InternalAthleteRole) => {
  try {
    const data: AttendanceToken = {
      id: getAttendanceId(role),
      token: v4(),
      date: Date.now(),
      status: true,
      role,
    };

    await axios.post("/api/attendance/token", data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateAttendanceToken = async (token: AttendanceToken) => {
  try {
    await axios.patch("/api/attendance/token", token);
    return token;
  } catch (error) {
    throw error;
  }
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
    const token: AttendanceToken = await getAttendanceToken(role);

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

    await axios.post("/api/attendance", data);
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
