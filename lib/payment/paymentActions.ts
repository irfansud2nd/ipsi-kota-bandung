"use server";

import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { getStartEndOfDay } from "../functions";
import { Payment, PaymentSql } from "./paymentConstants";

// PAYMENT SQL
// CREATE
export const addPaymentSql = async (paymentSql: PaymentSql) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { error } = await supabase.from("payments").insert(paymentSql);

    if (error) throw error;

    return paymentSql;
  } catch (error) {
    throw error;
  }
};

// UPDATE
export const updatePaymentSql = async (paymentSql: PaymentSql) => {
  try {
    const response = await apiProtect({
      directory: "payment",
    });
    if (response) throw response;

    const { error } = await supabase
      .from("payments")
      .update(paymentSql)
      .eq("id", paymentSql.id);

    if (error) throw error;

    return paymentSql;
  } catch (error) {
    throw error;
  }
};

// CREATE
export const deletePaymentSql = async (paymentSql: PaymentSql) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", paymentSql.id);

    if (error) throw error;

    return paymentSql;
  } catch (error) {
    throw error;
  }
};

// PAYMENT
// READ
export const getPaymentsByContingentRegistrationId = async (
  contingentRegsitrationId: number
) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { data, error } = await supabase
      .rpc("get_payment_by_contingent_registration_id", {
        cont_reg_id: contingentRegsitrationId,
      })
      .returns<Payment[]>();

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

export const getConfirmedPaymentByChampionshipId = async (
  championshipId: string,
  page: number,
  limit: number
) => {
  try {
    const response = await apiProtect({
      directory: "championship",
    });
    if (response) throw response;

    const { data, error } = await supabase
      .rpc("get_confirmed_payment_by_championship_id", {
        champ_id: championshipId,
        pg: page,
        lmt: limit,
      })
      .returns<Payment[]>();

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

export const getUnconfirmedPaymentByChampionshipId = async (
  championshipId: string,
  page: number,
  limit: number
) => {
  try {
    const response = await apiProtect({
      directory: "championship",
    });
    if (response) throw response;

    const { data, error } = await supabase
      .rpc("get_unconfirmed_payment_by_championship_id", {
        champ_id: championshipId,
        pg: page,
        lmt: limit,
      })
      .returns<Payment[]>();

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

// OTHERS
export const countPaymentSqlBefore = async (time: number) => {
  const { start } = getStartEndOfDay(time);
  try {
    const { count, error } = await supabase
      .from("payments")
      .select("id", { count: "exact" })
      .gt("created_at", start)
      .lt("created_at", time);

    if (error) throw error;
    return (count || 0) + 1;
  } catch (error) {
    throw error;
  }
};

export const sumPaymentBillByChampionshipId = async (
  championshipId: string
) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { data, error } = await supabase
      .rpc("sum_payment_bill_by_championship_id", {
        champ_id: championshipId,
      })
      .returns<number>();

    if (error) throw error;

    return data || 0;
  } catch (error) {
    throw error;
  }
};

export const sumPaymentTotalByChampionshipId = async (
  championshipId: string
) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { data, error } = await supabase
      .rpc("sum_payment_total_by_championship_id", {
        champ_id: championshipId,
      })
      .returns<number>();

    if (error) throw error;

    return data || 0;
  } catch (error) {
    throw error;
  }
};

export const sumConfirmedPaymentByChampionshipId = async (
  championshipId: string
) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { data, error } = await supabase
      .rpc("sum_confirmed_payment_by_championship_id", {
        champ_id: championshipId,
      })
      .returns<number>();

    if (error) throw error;

    return data || 0;
  } catch (error) {
    throw error;
  }
};

export const sumUnconfirmedPaymentByChampionshipId = async (
  championshipId: string
) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { data, error } = await supabase
      .rpc("sum_unconfirmed_payment_by_championship_id", {
        champ_id: championshipId,
      })
      .returns<number>();

    if (error) throw error;

    return data || 0;
  } catch (error) {
    throw error;
  }
};
