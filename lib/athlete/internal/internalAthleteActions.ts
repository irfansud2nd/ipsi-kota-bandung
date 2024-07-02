"use server";
import { apiProtect } from "@/lib/admin/adminActions";
import {
  Attendance,
  AttendanceReport,
  AttendanceToken,
  AttendanceType,
  InternalAthleteRole,
} from "./internalAthleteConstants";
import supabase from "@/lib/database/supabase";
import { getAttendanceId } from "./internalAthleteFunctions";
import { v4 } from "uuid";
import { cache } from "react";
import { action } from "@/lib/functions";
import { ServerAction } from "@/lib/constants";

// ATTENDANCE SQL
// CREATE
export const addAttendanceSql = async (
  attendance: Attendance
): Promise<ServerAction<Attendance>> => {
  try {
    const response = await apiProtect({
      permittedEmail: attendance.email,
      roles: ["coach"],
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase.from("attendances").insert(attendance);
    if (error) throw new Error(error.message);

    return action.success(attendance);
  } catch (error) {
    return action.error(error);
  }
};

// UPDATE
export const updateAttendanceSql = async (
  id: string,
  type: AttendanceType
): Promise<ServerAction<string>> => {
  try {
    const response = await apiProtect({
      roles: ["coach"],
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("attendances")
      .update({ type: type })
      .eq("id", id);

    if (error) throw new Error(error.message);

    return action.success("success");
  } catch (error) {
    return action.error(error);
  }
};

// DELETE
export const deleteAttendanceSql = async (
  id: string
): Promise<ServerAction<string>> => {
  try {
    const response = await apiProtect({
      roles: ["coach"],
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase.from("attendances").delete().eq("id", id);

    if (error) throw new Error(error.message);

    return action.success("success");
  } catch (error) {
    return action.error(error);
  }
};

// ATTENDANCE TOKEN
// CREATE
export const addAttendanceToken = async (
  role: InternalAthleteRole
): Promise<ServerAction<AttendanceToken>> => {
  try {
    const data: AttendanceToken = {
      id: getAttendanceId(role),
      token: v4(),
      date: Date.now(),
      status: true,
      role,
    };

    const response = await apiProtect({ roles: ["coach"] });
    if (response) throw new Error(response.message);

    const { error } = await supabase.from("attendance_tokens").insert(data);

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

// READ
export const getAttendanceToken = async (
  role: InternalAthleteRole
): Promise<ServerAction<AttendanceToken | undefined>> => {
  try {
    const id = getAttendanceId(role);

    const { data, error } = await supabase
      .from("attendance_tokens")
      .select()
      .eq("role", role)
      .eq("id", id)
      .returns<AttendanceToken[]>();

    if (error) throw new Error(error.message);

    return action.success(data.length ? data[0] : undefined);
  } catch (error) {
    return action.error(error);
  }
};

// UPDATE
export const updateAttendanceToken = async (
  token: AttendanceToken
): Promise<ServerAction<AttendanceToken>> => {
  try {
    const response = await apiProtect({ roles: ["coach"] });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("attendanceTokens")
      .update({ status: token.status })
      .eq("token", token.token);

    if (error) throw new Error(error.message);

    return action.success(token);
  } catch (error) {
    return action.error(error);
  }
};

// ATTENDANCE
// READ
export const getAttendances = cache(
  async (
    role: InternalAthleteRole,
    month: string
  ): Promise<ServerAction<AttendanceReport[]>> => {
    let start = new Date(month);
    start.setDate(1);
    start.setHours(0, 0, 1);
    let end = new Date(month);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59);

    try {
      const response = await apiProtect({
        directory: `admin/${role}`,
        throwError: true,
      });
      if (response) throw new Error(response.message);

      const { data, error } = await supabase
        .from("special_users")
        .select("email, name, attendances(id,date,type)")
        .contains("roles", [role])
        .gte("attendances.date", start.getTime())
        .lte("attendances.date", end.getTime())
        .eq("attendances.role", role)
        .returns<AttendanceReport[]>();

      if (error) throw new Error(error.message);

      return action.success(data);
    } catch (error) {
      return action.error(error);
    }
  }
);
