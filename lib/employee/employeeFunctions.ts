import { toast } from "sonner";
import { Employee, EmployeeSql } from "./employeeConstants";
import { v4 } from "uuid";
import axios from "axios";
import { sendFile, toastError } from "../form/formFunctions";
import { getFileUrl } from "../functions";
import { addEmployeeSql, updateEmployeeSql } from "./employeeActions";

// EMPLOYEE
// READ

// CREATE
export const addEmployee = async (employee: Employee) => {
  const toastId = toast.loading("Menambahkan pengurus");

  try {
    let data: Employee = employee;
    data.id = v4();
    const { imageUrl } = getFileUrl("employee", data.id);

    if (data.image?.file) {
      toast.loading("Mengunggah gambar", { id: toastId });
      data.image.downloadUrl = await sendFile(data.image.file, imageUrl);
      delete data.image.file;
    }

    toast.loading("Mengunggah pengurus", { id: toastId });
    await addEmployeeSql(employeeToEmployeeSql(data));
    toast.success("Pengurus berhasil diunggah", { id: toastId });
    return { result: data };
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// UPDATE
export const updateEmployee = async (employee: Employee) => {
  const toastId = toast.loading("Memperbaharui pengurus");
  try {
    let data: Employee = employee;
    const { imageUrl } = getFileUrl("employee", data.id);

    if (data.image?.file) {
      toast.loading("Memperbaharui gambar", { id: toastId });
      data.image.downloadUrl = await sendFile(data.image.file, imageUrl);
      delete data.image.file;
    }

    toast.loading("Memperbaharui pengurus", { id: toastId });
    await updateEmployeeSql(employeeToEmployeeSql(data));
    toast.success("Pengurus berhasil diperbaharui", { id: toastId });
    return { result: data };
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// OTHERS
export const employeeSqlToEmployee = (employeeSql: EmployeeSql) => {
  const result: Employee = {
    ...employeeSql,
    image: {
      downloadUrl: employeeSql.image,
    },
  };
  return result;
};

export const employeeToEmployeeSql = (employee: Employee) => {
  const result: EmployeeSql = {
    ...employee,
    image: employee.image?.downloadUrl || "",
  };
  return result;
};
