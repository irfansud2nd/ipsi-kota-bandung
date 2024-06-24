"use server";
import { cache } from "react";
import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { EmployeeSql } from "./employeeConstants";
import { employeeSqlToEmployee } from "./employeeFunctions";

// EMPLOYEE SQL
// READ
export const getEmployees = cache(async (page: number, limit: number) => {
  try {
    let getData = supabase
      .from("employees")
      .select()
      .order("order")
      .range(page * limit - limit, page * limit - 1)
      .returns<EmployeeSql[]>();

    const { data, error } = await getData;

    if (error) throw new Error(error.message);

    const employees = data.map((item) => employeeSqlToEmployee(item));

    return employees;
  } catch (error) {
    throw error;
  }
});

//   CREATE
export const addEmployeeSql = async (employee: EmployeeSql) => {
  try {
    const response = await apiProtect({ directory: "employee" });
    if (response) throw response;
    let data: any = employee;
    delete data.order;

    const { error } = await supabase.from("employees").insert(data);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// UPDATE
export const updateEmployeeSql = async (employee: EmployeeSql) => {
  try {
    const response = await apiProtect({ directory: "employee" });
    if (response) throw response;

    const { error } = await supabase
      .from("employees")
      .update(employee)
      .eq("id", employee.id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
