export type InternalAthleteRole =
  | "palAthlete"
  | "popwildaAthlete"
  | "porprovAthlete";

export const internalAthleteRoles: InternalAthleteRole[] = [
  "palAthlete",
  "popwildaAthlete",
  "porprovAthlete",
];

export type AttendanceToken = {
  id: string;
  token: string;
  date: number;
  status: boolean;
  role: InternalAthleteRole;
};

export type AttendanceType = "present" | "sick" | "leave" | "negligent";

export const attendanceTypes: AttendanceType[] = [
  "present",
  "sick",
  "leave",
  "negligent",
];

export type Attendance = {
  id: string;
  email: string;
  date: number;
  type: AttendanceType;
  role: InternalAthleteRole;
};

export type AttendanceReport = {
  email: string;
  name: string;
  attendances: {
    id: string;
    date: number;
    type: AttendanceType;
  }[];
};
