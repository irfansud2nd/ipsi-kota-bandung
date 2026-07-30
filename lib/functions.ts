import { PostgrestError } from "@supabase/supabase-js";
import { SpecialUserRole } from "./admin/adminConstants";
import { ServerAction } from "./constants";
import { date } from "yup";

// FORMAT TANGGAL
export const formatDate = (
  inputDate: number | string,
  options?: {
    withoutHour?: boolean;
    longMonth?: boolean;
    hourOnly?: boolean;
    withoutYear?: boolean;
    htmlFormat?: boolean;
    shortYear?: boolean;
    monthNumber?: boolean;
  }
) => {
  const dateObj = new Date(inputDate);
  const timeZone = "Asia/Jakarta";

  const parts = new Intl.DateTimeFormat("id-ID", {
    timeZone,
    day: "2-digit",
    month: options?.monthNumber
      ? "2-digit"
      : options?.longMonth
      ? "long"
      : "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(dateObj);

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  const day = getPart("day");
  let month = getPart("month");
  let year = getPart("year");
  const hour = getPart("hour");
  const minute = getPart("minute");

  if (options?.shortYear) year = year.slice(-2);

  let result = `${day} ${month} `;
  if (!options?.withoutYear) result += `${year}`;
  if (!options?.withoutHour) result += ` - ${hour}:${minute}`;
  if (options?.hourOnly) result = `${hour}:${minute}`;

  if (options?.htmlFormat) {
    result = `${year}-${getPart("month")}-${day} 00:01`;
    if (options.withoutHour) result = result.replace(" 00:01", "");
    if (options?.hourOnly) result = `${hour}:${minute}`;
    if (!inputDate) result = "";
  }

  return result;
};

export const dateToNumber = (date: string, time?: string) => {
  let result = 0;
  if (!date) return result;
  if (time) {
    result = new Date(`${date}T` + time + ":00").getTime();
  } else {
    result = new Date(date).getTime();
  }
  return result;
};

export const timeToNumber = (time: string) => {
  return new Date("2000-01-01T" + time + ":00").getTime();
};

// COMPARE FOR DATA SORTER
export const compare = (query: string, type: "asc" | "desc") => {
  return (a: any, b: any) => {
    if (a[query] < b[query]) {
      return type == "asc" ? -1 : 1;
    }
    if (a[query] > b[query]) {
      return type == "asc" ? 1 : -1;
    }
    return 0;
  };
};

export const getSpecialUserLabel = (role: SpecialUserRole) => {
  let label: string = role;
  if (role == "eventAdmin") return "Admin Event";
  if (!role.includes("Athlete"))
    return label.charAt(0).toUpperCase() + label.slice(1);
  label = label.replace("Athlete", "");
  label = label.toUpperCase();
  return `Atlet ${label}`;
};

export const getStartEndOfDay = (date?: string | number) => {
  let start = date ? new Date(date) : new Date();
  start.setHours(0, 0, 1);
  let end = date ? new Date(date) : new Date();
  end.setHours(23, 59, 59);

  return { start: start.getTime(), end: end.getTime() };
};

export const reduceData = (data: any[], key: string = "id") => {
  const reducedData = Object.values(
    data.reduce((acc, obj) => {
      acc[obj[key]] = obj;
      return acc;
    }, {} as any)
  );
  return reducedData;
};

export const getFileUrl = (
  type: "athlete" | "official" | "news" | "event" | "employee" | "payment",
  id: string
) => {
  return {
    imageUrl: `${type}/image/${id}_${Date.now()}`,
    kkUrl: `${type}/kk/${id}_${Date.now()}`,
    idCardUrl: `${type}/id_card/${id}_${Date.now()}`,
    certificateUrl: `${type}/certificate/${id}_${Date.now()}`,
    proofUrl: `${type}/${id}_${Date.now()}`,
  };
};

export const formatToRupiah = (input: string | number, rerverse?: boolean) => {
  if (rerverse) {
    return input.toString().replace(/[^0-9]/g, "");
  }
  return `${Number(input) < 0 ? "- " : ""} Rp ${Math.abs(
    Number(input)
  ).toLocaleString("id")}`;
};

export const action = {
  success: <T>(result: T): ServerAction<T> => {
    return { result, error: null };
  },
  error: <T>(error: any): ServerAction<T> => {
    console.log(error);
    return { result: null, error: error as PostgrestError };
  },
};

export const fetchData = async <T>(
  asyncFunction: () => Promise<ServerAction<T>>
): Promise<T> => {
  try {
    const { result, error } = await asyncFunction();

    if (error) throw error;

    return result;
  } catch (error) {
    throw error;
  }
};
