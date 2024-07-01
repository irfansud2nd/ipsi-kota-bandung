"use server";
import { apiProtect } from "../admin/adminActions";
import { countAthleteByContingentId } from "../athlete/external/athleteActions";
import supabase from "../database/supabase";
import { countOfficialByContingentId } from "../official/officialActions";
import {
  Contingent,
  ContingentAtEventSql,
  ContingentSql,
  RegisteredContingent,
  RegisteredContingentAdmin,
} from "./contingentConstants";

// CONTINGENT
// GET
export const getContingentByEmail = async (email: string) => {
  try {
    const response = await apiProtect({ permittedEmail: email });
    if (response) throw response;

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

export const getContingents = async (
  page: number,
  limit: number,
  showAll: boolean = false
) => {
  try {
    const response = await apiProtect({ directory: "contingent" });
    if (response) throw response;

    let params = {
      pg: page,
      lmt: limit,
    };

    if (showAll)
      params = {
        pg: 1,
        lmt: 1000,
      };

    const { data, error } = await supabase
      .rpc("get_contingents", params)
      .returns<Contingent[]>();

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

export const countContingent = async () => {
  try {
    const { count, error } = await supabase
      .from("contingents")
      .select("id", { count: "exact", head: true });

    if (error) throw error;

    return count || 0;
  } catch (error) {
    throw error;
  }
};

// CONTINGENT SQL
export const addContingentSql = async (contingentSql: ContingentSql) => {
  try {
    const response = await apiProtect({
      permittedEmail: contingentSql.created_by,
    });
    if (response) throw response;
    const { data } = await supabase
      .from("contingents")
      .select("created_by")
      .ilike("name", `%${contingentSql.name}%`);

    if (data?.length) {
      const emailList = data.map((item) => item.created_by);
      throw {
        message: `Nama kontingen ${
          contingentSql.name
        } telah digunakan, hubungi pendaftar dengan nama kontingen yang sama (${emailList.join(
          " "
        )})`,
      };
    }

    const { error } = await supabase.from("contingents").insert(contingentSql);

    if (error) throw error;

    return { result: contingentSql };
  } catch (error) {
    return { error };
  }
};
export const updateContingentSql = async (contingentSql: ContingentSql) => {
  try {
    const response = await apiProtect({
      permittedEmail: contingentSql.created_by,
    });
    if (response) throw response;

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
    const response = await apiProtect({
      permittedEmail: contingentSql.created_by,
    });
    if (response) throw response;

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
// READ
export const getContingenAtEvents = async (contingentId: string) => {
  try {
    const response = await apiProtect({ loggedInOnly: true });
    if (response) throw response;

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

export const countContingentAtEventByChampionshipId = async (
  championshipId: string
) => {
  try {
    const { count, error } = await supabase
      .from("contingent_at_events")
      .select("registration_id", { count: "exact", head: true })
      .eq("championship_id", championshipId);

    if (error) throw error;

    return count || 0;
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

    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

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
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { error } = await supabase
      .from("contingent_at_events")
      .delete()
      .eq("registration_id", contingentAtEventSql.registration_id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// REGISTERD CONTINGENT
// READ
export const getRegisteredContingents = async (
  championshipId: string,
  page: number,
  limit: number,
  showAll: boolean = false
) => {
  try {
    const response = await apiProtect({ directory: "championship" });
    if (response) throw response;

    let params = {
      champ_id: championshipId,
      pg: page,
      lmt: limit,
    };

    if (showAll) {
      params.pg = 1;
      params.lmt = 4000;
    }

    const { data, error } = await supabase
      .rpc("get_registered_contingent_admin_by_championship_id", params)
      .returns<RegisteredContingentAdmin[]>();

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};
