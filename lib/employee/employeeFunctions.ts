import { toast } from "sonner";
import { Employee, EmployeeSql } from "./employeeConstants";
import { v4 } from "uuid";
import axios from "axios";
import { sendFile, toastError } from "../form/formFunctions";
import { getFileUrl } from "../functions";
import {
  addEmployeeSql,
  getEmployeesSql,
  updateEmployeeSql,
} from "./employeeActions";
import { cache } from "react";

// EMPLOYEE
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

    const { result, error } = await addEmployeeSql(employeeToEmployeeSql(data));
    if (error) throw error;

    toast.success("Pengurus berhasil diunggah", { id: toastId });
    return employeeSqlToEmployee(result);
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// READ
export const getEmployees = cache(async (page: number, limit: number) => {
  try {
    const { result, error } = await getEmployeesSql(page, limit);

    if (error) throw new Error(error.message);

    const employees = result.map((item) => employeeSqlToEmployee(item));

    return employees;
  } catch (error) {
    throw error;
  }
});

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

    const { error } = await updateEmployeeSql(employeeToEmployeeSql(data));
    if (error) throw error;

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
