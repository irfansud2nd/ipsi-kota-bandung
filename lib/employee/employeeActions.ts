"use server";
import { cache } from "react";
import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { EmployeeSql } from "./employeeConstants";
import { ServerAction } from "../constants";
import { action } from "../functions";

// EMPLOYEE SQL
// CREATE
export const addEmployeeSql = async (
  employeeSql: EmployeeSql
): Promise<ServerAction<EmployeeSql>> => {
  try {
    const response = await apiProtect({ directory: "employee" });
    if (response) throw new Error(response.message);

    let dataToSend: any = employeeSql;
    if (employeeSql.order == 0) {
      delete dataToSend.order;
    }

    const { error, data } = await supabase
      .from("employees")
      .insert(dataToSend)
      .select()
      .returns<EmployeeSql[]>();

    if (error) throw new Error(error.message);
    return action.success(data[0]);
  } catch (error) {
    return action.error(error);
  }
};

// READ
export const getEmployeesSql = cache(
  async (page: number, limit: number): Promise<ServerAction<EmployeeSql[]>> => {
    try {
      let getData = supabase
        .from("employees")
        .select()
        .order("order")
        .range(page * limit - limit, page * limit - 1)
        .returns<EmployeeSql[]>();

      const { data, error } = await getData;

      if (error) throw new Error(error.message);

      return action.success(data);
    } catch (error) {
      return action.error(error);
    }
  }
);

// UPDATE
export const updateEmployeeSql = async (
  employeeSql: EmployeeSql
): Promise<ServerAction<EmployeeSql>> => {
  try {
    const response = await apiProtect({ directory: "employee" });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("employees")
      .update(employeeSql)
      .eq("id", employeeSql.id);

    if (error) throw new Error(error.message);

    return action.success(employeeSql);
  } catch (error) {
    return action.error(error);
  }
};

// DELETE
export const deleteEmployeeSql = async (
  employeeSql: EmployeeSql
): Promise<ServerAction<EmployeeSql>> => {
  try {
    const response = await apiProtect({ directory: "employee" });
    if (response) throw new Error(response.message);

    console.log("id", employeeSql.id);

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", employeeSql.id);

    if (error) throw new Error(error.message);

    return action.success(employeeSql);
  } catch (error) {
    return action.error(error);
  }
};
