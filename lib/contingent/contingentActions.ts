"use server";
import { apiProtect } from "../admin/adminActions";
import { countAthleteByContingentId } from "../athlete/external/athleteActions";
import supabase from "../database/supabase";
import { countOfficialByContingentId } from "../official/officialActions";
import {
  Contingent,
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
export const getContingents = async (
  page: number,
  limit: number,
  showAll: boolean = false
) => {
  try {
    let getData = supabase
      .from("contingents")
      .select()
      .order("created_at", { ascending: false })
      .returns<ContingentSql[]>();

    if (!showAll)
      getData = getData.range(page * limit - limit, page * limit - 1);

    const { data, error } = await getData;
    if (error) throw error;

    let result: Contingent[] = [];

    if (!data.length) return result;

    result = data.map((item) => ({ ...item, athletes: 0, officials: 0 }));

    // for (const contingentSql of data) {
    //   try {
    //     const athletes = await countAthleteByContingentId(contingentSql.id);
    //     const officials = await countOfficialByContingentId(contingentSql.id);

    //     result.push({
    //       ...contingentSql,
    //       athletes,
    //       officials,
    //     });
    //   } catch (error) {
    //     throw error;
    //   }
    // }

    return result;
  } catch (error) {
    throw error;
  }
};

export const addContingentSql = async (contingentSql: ContingentSql) => {
  try {
    const { message } = await apiProtect({
      permittedEmail: contingentSql.created_by,
    });
    if (message) throw new Error(message);
    const { data } = await supabase
      .from("contingents")
      .select("created_by")
      .ilike("name", `%${contingentSql.name}%`);

    if (data?.length) {
      const emailList = data.map((item) => item.created_by);
      throw new Error(
        `Nama kontingen ${
          contingentSql.name
        } telah digunakan, hubungi pendaftar dengan nama kontingen yang sama (${emailList.join(
          " "
        )})`
      );
    }

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
