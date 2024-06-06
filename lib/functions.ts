import { SpecialUserRole } from "./admin/adminConstants";

// FORMAT TANGGAL
export const formatDate = (
  inputDate: number | string,
  options?: {
    withoutHour?: boolean;
    longMonth?: boolean;
    hourOnly?: boolean;
    withoutYear?: boolean;
    htmlFormat?: boolean;
  }
) => {
  const formattedDate = new Date(inputDate);
  const date = formattedDate.getDate().toString().padStart(2, "0");
  const year = formattedDate.getFullYear();
  const month = {
    string: formattedDate.toLocaleString("id", {
      month: options?.longMonth ? "long" : "short",
    }),
    number: (formattedDate.getMonth() + 1).toString().padStart(2, "0"),
  };
  const hour = formattedDate.getHours().toString().padStart(2, "0");
  const minute = formattedDate.getMinutes().toString().padStart(2, "0");

  let result = `${date} ${month.string} `;

  !options?.withoutYear && (result += `${year} `);

  !options?.withoutHour && (result += `- ${hour}:${minute}`);

  options?.hourOnly && (result = `${hour}:${minute}`);

  if (options?.htmlFormat) {
    result = `${year}-${month.number}-${date} 00:01`;
    options.withoutHour && (result = result.replace(" 00:01", ""));
    options?.hourOnly && (result = `${hour}:${minute}`);
    if (!inputDate) result = "";
  }

  return result;
};

export const dateToNumber = (date: string, time?: boolean) => {
  let result = 0;
  if (!date) return result;
  if (time) {
    result = new Date("2000-01-01 " + date + ":00").getTime();
  } else {
    result = new Date(date).getTime();
  }
  return result;
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
  if (role == "adminEvent") return "Admin Event";
  if (!role.includes("Athlete")) return label;
  label = label.replace("Athlete", "");
  label = label.toUpperCase();
  return `Atlet ${label}`;
};

export const getStartEndOfDay = (date?: string) => {
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
  type: "athlete" | "official" | "news" | "member" | "payment",
  id: string
) => {
  return {
    imageUrl: `${type}/image/${id}`,
    kkUrl: `${type}/kk/${id}`,
    ktpUrl: `${type}/ktp/${id}`,
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
