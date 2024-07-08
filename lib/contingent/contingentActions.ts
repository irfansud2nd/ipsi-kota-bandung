"use server";
import { apiProtect } from "../admin/adminActions";
import {} from "../athlete/external/athleteActions";
import supabase from "../database/supabase";
import {
  Contingent,
  ContingentAtEvent,
  ContingentAtEventSql,
  ContingentSql,
  RegisteredContingentAdmin,
} from "./contingentConstants";
import { ServerAction } from "../constants";
import { action } from "../functions";

// CONTINGENT
// READ
export const getContingentByEmail = async (
  email: string
): Promise<ServerAction<Contingent | undefined>> => {
  try {
    const response = await apiProtect({ permittedEmail: email });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .rpc("get_contingent_by_email", {
        email: email,
      })
      .returns<Contingent[]>();

    if (error) throw new Error(error.message);

    if (!data.length) action.success(undefined);

    return action.success(data[0]);
  } catch (error) {
    return action.error(error);
  }
};

export const getContingents = async (
  page: number,
  limit: number,
  showAll: boolean = false
): Promise<ServerAction<Contingent[]>> => {
  try {
    const response = await apiProtect({ directory: "contingent" });
    if (response) throw new Error(response.message);

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

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const getContingentById = async (
  id: string
): Promise<ServerAction<Contingent | undefined>> => {
  try {
    const response = await apiProtect({ directory: "championship" });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .rpc("get_contingent_by_id", {
        identification: id,
      })
      .returns<Contingent[]>();

    if (error) throw new Error(error.message);

    if (!data.length) action.success(undefined);

    return action.success(data[0]);
  } catch (error) {
    return action.error(error);
  }
};

// CONTINGENT SQL
// CREATE
export const addContingentSql = async (
  contingentSql: ContingentSql
): Promise<ServerAction<ContingentSql>> => {
  try {
    const response = await apiProtect({
      permittedEmail: contingentSql.created_by,
    });
    if (response) throw new Error(response.message);

    const { data } = await supabase
      .from("contingents")
      .select("created_by, name")
      .ilike("name", `%${contingentSql.name}%`);

    if (data?.length) {
      const infos = data.map((item) => `${item.name} -> ${item.created_by}`);
      throw {
        message: `Nama kontingen ${
          contingentSql.name
        } telah digunakan, hubungi pendaftar dengan nama kontingen yang sama. ( ${infos.join(
          " | "
        )} )`,
      };
    }

    const { error } = await supabase.from("contingents").insert(contingentSql);
    if (error) throw new Error(error.message);

    return action.success(contingentSql);
  } catch (error) {
    return action.error(error);
  }
};

// UPDATE
export const updateContingentSql = async (
  contingentSql: ContingentSql
): Promise<ServerAction<ContingentSql>> => {
  try {
    const response = await apiProtect({
      permittedEmail: contingentSql.created_by,
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("contingents")
      .update(contingentSql)
      .eq("id", contingentSql.id);

    if (error) throw new Error(error.message);

    return action.success(contingentSql);
  } catch (error) {
    return action.error(error);
  }
};

// DELETE
export const deleteContingentSql = async (
  contingentSql: ContingentSql
): Promise<ServerAction<ContingentSql>> => {
  try {
    const response = await apiProtect({
      permittedEmail: contingentSql.created_by,
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("contingents")
      .delete()
      .eq("id", contingentSql.id);

    if (error) throw new Error(error.message);

    return action.success(contingentSql);
  } catch (error) {
    return action.error(error);
  }
};

// CONTINGENT AT EVENT
// READ
export const getContingenAtEventsByContingentId = async (
  contingentId: string
): Promise<ServerAction<ContingentAtEvent[]>> => {
  try {
    const response = await apiProtect({ loggedInOnly: true });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .rpc("get_contingent_at_events_by_contingent_id", {
        cont_id: contingentId,
      })
      .returns<ContingentAtEvent[]>();

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

// CONTINGENT AT EVENT SQL
// CREATE
export const addContingentAtEventSql = async (
  contingentAtEventSql: ContingentAtEventSql
): Promise<ServerAction<ContingentAtEventSql>> => {
  try {
    const dataToSend: any = contingentAtEventSql;
    delete dataToSend.registration_id;

    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { error, data } = await supabase
      .from("contingent_at_events")
      .insert(dataToSend)
      .select()
      .returns<ContingentAtEventSql[]>();

    if (error) throw new Error(error.message);

    return action.success(data[0]);
  } catch (error) {
    return action.error(error);
  }
};

// DELETE
export const deleteContingentAtEventSql = async (
  contingentAtEventSql: ContingentAtEventSql
): Promise<ServerAction<ContingentAtEventSql>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("contingent_at_events")
      .delete()
      .eq("registration_id", contingentAtEventSql.registration_id);

    if (error) throw new Error(error.message);

    return action.success(contingentAtEventSql);
  } catch (error) {
    return action.error(error);
  }
};

// REGISTERED CONTINGENT
// READ
export const getRegisteredContingentAdminsByChampionshipId = async (
  championshipId: string,
  page: number,
  limit: number,
  showAll: boolean = false
): Promise<ServerAction<RegisteredContingentAdmin[]>> => {
  try {
    const response = await apiProtect({ directory: "championship" });
    if (response) throw new Error(response.message);

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

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const getRegisteredContingentAdminByContingentId = async (
  contingentId: string,
  championshipId: string
): Promise<ServerAction<RegisteredContingentAdmin | undefined>> => {
  try {
    const response = await apiProtect({ directory: "championship" });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .rpc("get_registered_contingent_admin_by_contingent_id", {
        cont_id: contingentId,
        champ_id: championshipId,
      })
      .returns<RegisteredContingentAdmin[]>();

    if (error) throw new Error(error.message);

    if (!data.length) return action.success(undefined);

    return action.success(data[0]);
  } catch (error) {
    return action.error(error);
  }
};

// OTHERS
export const countContingent = async (): Promise<ServerAction<number>> => {
  try {
    const { count, error } = await supabase
      .from("contingents")
      .select("id", { count: "exact", head: true });

    if (error) throw new Error(error.message);

    return action.success(count || 0);
  } catch (error) {
    return action.error(error);
  }
};

export const countContingentAtEventByChampionshipId = async (
  championshipId: string
): Promise<ServerAction<number>> => {
  try {
    const { count, error } = await supabase
      .from("contingent_at_events")
      .select("registration_id", { count: "exact", head: true })
      .eq("championship_id", championshipId);

    if (error) throw new Error(error.message);

    return action.success(count || 0);
  } catch (error) {
    return action.error(error);
  }
};
