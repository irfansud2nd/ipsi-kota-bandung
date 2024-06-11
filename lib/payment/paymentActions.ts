"use server";

import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import { Payment, PaymentSql } from "./paymentConstants";

// PAYMENT SQL
export const addPaymentSql = async (paymentSql: PaymentSql) => {
  try {
    const { message } = await apiProtect({
      loggedInOnly: true,
    });
    if (message) throw new Error(message);

    const { error } = await supabase.from("payments").insert(paymentSql);

    if (error) throw error;

    return paymentSql;
  } catch (error) {
    throw error;
  }
};

// PAYMENT
export const getPaymentsByContingentRegistrationId = async (
  contingentRegsitrationId: number
) => {
  try {
    const { message } = await apiProtect({
      loggedInOnly: true,
    });
    if (message) throw new Error(message);

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
