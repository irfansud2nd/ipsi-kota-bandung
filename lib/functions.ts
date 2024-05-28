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
    options.withoutHour && result.replace(" 00:01", "");
    options?.hourOnly && (result = `${hour}:${minute}`);
    if (!inputDate) result = "";
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
