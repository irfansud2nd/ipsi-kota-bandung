"use server";
import { apiProtect } from "../admin/adminActions";
import supabase from "../database/supabase";
import {
  Contingent,
  ContingentAtEvent,
  ContingentAtEventSql,
  ContingentSql,
} from "./contingentConstants";

// CONTINGENT
export const getContingentByEmail = async (email: string) => {
  try {
    const { message } = await apiProtect({ permittedEmail: email });
    if (message) throw { message };

    const { data, error } = await supabase
      .rpc("get_contingent_by_email", {
        email: email,
      })
      .returns<Contingent[]>();

    if (error) throw error;

    if (!data.length) return;

    return data[0];
  } catch (error) {
    throw error;
  }
};

// CONTINGENT SQL
export const addContingentSql = async (contingentSql: ContingentSql) => {
  try {
    const { message } = await apiProtect({
      permittedEmail: contingentSql.created_by,
    });
    if (message) throw new Error(message);
    const { count } = await supabase
      .from("contingents")
      .select("name", { count: "exact", head: true })
      .ilike("name", `%${contingentSql.name}%`);

    if (count && count > 0)
      throw new Error(`Nama kontingent ${contingentSql.name} telah digunakan, 
        gunakan nama lain atau hubungi pendaftar dengan nama kontingen yang sama`);

    const { error } = await supabase.from("contingents").insert(contingentSql);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
export const updateContingentSql = async (contingentSql: ContingentSql) => {
  try {
    const { message } = await apiProtect({
      permittedEmail: contingentSql.created_by,
    });
    if (message) throw new Error(message);

    const { error } = await supabase
      .from("contingents")
      .update(contingentSql)
      .eq("id", contingentSql.id);

    if (error) throw error;

    return contingentSql;
  } catch (error) {
    throw error;
  }
};

export const deleteContingentSql = async (contingentSql: ContingentSql) => {
  try {
    const { message } = await apiProtect({
      permittedEmail: contingentSql.created_by,
    });
    if (message) throw new Error(message);

    const { error } = await supabase
      .from("contingents")
      .delete()
      .eq("id", contingentSql.id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// CONTINGENT AT EVENT
export const getContingenAtEvents = async (contingentId: string) => {
  try {
    const { message } = await apiProtect({ loggedInOnly: true });
    if (message) throw new Error(message);

    const { data, error } = await supabase.rpc(
      "get_contingent_at_events_by_contingent_id",
      { cont_id: contingentId }
    );

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

// CONTINGENT AT EVENT SQL
export const addContingentAtEventSql = async (
  contingentAtEventSql: ContingentAtEventSql
) => {
  try {
    const dataToSend: any = contingentAtEventSql;
    delete dataToSend.registration_id;

    const { message } = await apiProtect({
      loggedInOnly: true,
    });
    if (message) throw new Error(message);

    const { error, data } = await supabase
      .from("contingent_at_events")
      .insert(dataToSend)
      .select()
      .returns<ContingentAtEventSql[]>();

    if (error) throw error;

    return data[0];
  } catch (error) {
    throw error;
  }
};

export const deleteContingentAtEventSql = async (
  contingentAtEventSql: ContingentAtEventSql
) => {
  try {
    const { message } = await apiProtect({
      loggedInOnly: true,
    });
    if (message) throw new Error(message);

    const { error } = await supabase
      .from("contingent_at_events")
      .delete()
      .eq("registration_id", contingentAtEventSql.registration_id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
