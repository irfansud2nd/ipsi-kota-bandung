"use server";

import { apiProtect } from "../admin/adminActions";
import { ServerAction } from "../constants";
import supabase from "../database/supabase";
import { action, getStartEndOfDay } from "../functions";
import { Payment, PaymentSql } from "./paymentConstants";

// PAYMENT SQL
// CREATE
export const addPaymentSql = async (
  paymentSql: PaymentSql
): Promise<ServerAction<PaymentSql>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase.from("payments").insert(paymentSql);

    if (error) throw new Error(error.message);

    return action.success(paymentSql);
  } catch (error) {
    return action.error(error);
  }
};

// UPDATE
export const updatePaymentSql = async (
  paymentSql: PaymentSql
): Promise<ServerAction<PaymentSql>> => {
  try {
    const response = await apiProtect({
      directory: "payment",
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("payments")
      .update(paymentSql)
      .eq("id", paymentSql.id);

    if (error) throw new Error(error.message);

    return action.success(paymentSql);
  } catch (error) {
    return action.error(error);
  }
};

// CREATE
export const deletePaymentSql = async (
  paymentSql: PaymentSql
): Promise<ServerAction<PaymentSql>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", paymentSql.id);

    if (error) throw new Error(error.message);

    return action.success(paymentSql);
  } catch (error) {
    return action.error(error);
  }
};

// PAYMENT
// READ
export const getPaymentsByContingentRegistrationId = async (
  contingentRegsitrationId: number
): Promise<ServerAction<Payment[]>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .rpc("get_payment_by_contingent_registration_id", {
        cont_reg_id: contingentRegsitrationId,
      })
      .returns<Payment[]>();

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const getConfirmedPaymentByChampionshipId = async (
  championshipId: string,
  page: number,
  limit: number,
  showAll: boolean = false
): Promise<ServerAction<Payment[]>> => {
  try {
    const response = await apiProtect({
      directory: "championship",
    });
    if (response) throw new Error(response.message);

    let params = {
      pg: page,
      lmt: limit,
    };

    if (showAll)
      params = {
        pg: 1,
        lmt: 4000,
      };

    const { data, error } = await supabase
      .rpc("get_confirmed_payment_by_championship_id", {
        champ_id: championshipId,
        ...params,
      })
      .returns<Payment[]>();

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const getUnconfirmedPaymentByChampionshipId = async (
  championshipId: string,
  page: number,
  limit: number,
  showAll: boolean = false
): Promise<ServerAction<Payment[]>> => {
  try {
    const response = await apiProtect({
      directory: "championship",
    });
    if (response) throw new Error(response.message);

    let params = {
      pg: page,
      lmt: limit,
    };

    if (showAll)
      params = {
        pg: 1,
        lmt: 4000,
      };

    const { data, error } = await supabase
      .rpc("get_unconfirmed_payment_by_championship_id", {
        champ_id: championshipId,
        ...params,
      })
      .returns<Payment[]>();

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const getPaymentById = async (
  id: string
): Promise<ServerAction<Payment | undefined>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .rpc("get_payment_by_id", {
        identification: id,
      })
      .returns<Payment[]>();

    if (error) throw new Error(error.message);

    if (!data.length) return action.success(undefined);

    return action.success(data[0]);
  } catch (error) {
    return action.error(error);
  }
};

// OTHERS
export const countPaymentSqlBefore = async (
  time: number
): Promise<ServerAction<number>> => {
  const { start } = getStartEndOfDay(time);
  try {
    const { count, error } = await supabase
      .from("payments")
      .select("id", { count: "exact" })
      .gt("created_at", start)
      .lt("created_at", time);

    if (error) throw new Error(error.message);
    return action.success((count || 0) + 1);
  } catch (error) {
    return action.error(error);
  }
};

export const sumPaymentBillByChampionshipId = async (
  championshipId: string
): Promise<ServerAction<number>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .rpc("sum_payment_bill_by_championship_id", {
        champ_id: championshipId,
      })
      .returns<number>();

    if (error) throw new Error(error.message);

    return action.success(data || 0);
  } catch (error) {
    return action.error(error);
  }
};

export const sumPaymentTotalByChampionshipId = async (
  championshipId: string
): Promise<ServerAction<number>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .rpc("sum_payment_total_by_championship_id", {
        champ_id: championshipId,
      })
      .returns<number>();

    if (error) throw new Error(error.message);

    return action.success(data || 0);
  } catch (error) {
    return action.error(error);
  }
};

export const sumConfirmedPaymentByChampionshipId = async (
  championshipId: string
): Promise<ServerAction<number>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .rpc("sum_confirmed_payment_by_championship_id", {
        champ_id: championshipId,
      })
      .returns<number>();

    if (error) throw new Error(error.message);

    return action.success(data || 0);
  } catch (error) {
    return action.error(error);
  }
};

export const sumUnconfirmedPaymentByChampionshipId = async (
  championshipId: string
): Promise<ServerAction<number>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .rpc("sum_unconfirmed_payment_by_championship_id", {
        champ_id: championshipId,
      })
      .returns<number>();

    if (error) throw new Error(error.message);

    return action.success(data || 0);
  } catch (error) {
    return action.error(error);
  }
};
