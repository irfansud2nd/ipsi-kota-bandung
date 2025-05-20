import { PostgrestError } from "@supabase/supabase-js";
import { SpecialUserRole } from "./admin/adminConstants";
import { ServerAction } from "./constants";

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
  const formattedDate = new Date(inputDate);
  const date = formattedDate.getDate().toString().padStart(2, "0");
  let year = formattedDate.getFullYear().toString();
  const month = {
    string: formattedDate.toLocaleString("id", {
      month: options?.longMonth ? "long" : "short",
    }),
    number: (formattedDate.getMonth() + 1).toString().padStart(2, "0"),
  };
  const hour = formattedDate.getHours().toString().padStart(2, "0");
  const minute = formattedDate.getMinutes().toString().padStart(2, "0");

  let result = `${date} ${options?.monthNumber ? month.number : month.string} `;

  if (options?.shortYear) year = year.substring(year.length - 2);

  !options?.withoutYear && (result += `${year}`);

  !options?.withoutHour && (result += ` - ${hour}:${minute}`);

  options?.hourOnly && (result = `${hour}:${minute}`);

  if (options?.htmlFormat) {
    result = `${year}-${month.number}-${date} 00:01`;
    options.withoutHour && (result = result.replace(" 00:01", ""));
    options?.hourOnly && (result = `${hour}:${minute}`);
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
    imageUrl: `${type}/image/${id}`,
    kkUrl: `${type}/kk/${id}`,
    ktpUrl: `${type}/ktp/${id}`,
    certificateUrl: `${type}/certificate/${id}`,
    proofUrl: `${type}/${id}`,
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
