"use server";
import { apiProtect } from "@/lib/admin/adminActions";
import supabase from "@/lib/database/supabase";
import {
  AthleteAtEvent,
  AthleteAtEventSql,
  AthleteSql,
  matchType,
} from "./athleteConstants";

// ATHLETE
export const getAthletesSqlByEmail = async (email: string) => {
  try {
    const { message } = await apiProtect({ permittedEmail: email });
    if (message) throw { message };

    const { data, error } = await supabase
      .from("athletes")
      .select()
      .eq("created_by", email)
      .returns<AthleteSql[]>();

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

export const addAthleteSql = async (athleteSql: AthleteSql) => {
  try {
    const { message } = await apiProtect({
      permittedEmail: athleteSql.created_by,
    });
    if (message) throw new Error(message);

    const { error } = await supabase.from("athletes").insert(athleteSql);

    if (error) throw error;

    return athleteSql;
  } catch (error) {
    throw error;
  }
};

export const updateAthleteSql = async (athleteSql: AthleteSql) => {
  try {
    const { message } = await apiProtect({
      permittedEmail: athleteSql.created_by,
    });
    if (message) throw new Error(message);

    const { error } = await supabase
      .from("athletes")
      .update(athleteSql)
      .eq("id", athleteSql.id);

    if (error) throw error;

    return athleteSql;
  } catch (error) {
    throw error;
  }
};
export const deleteAthleteSql = async (athleteSql: AthleteSql) => {
  try {
    const { message } = await apiProtect({
      permittedEmail: athleteSql.created_by,
    });
    if (message) throw new Error(message);

    const { error } = await supabase
      .from("athletes")
      .delete()
      .eq("id", athleteSql.id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// ATHLETE AT EVENTS
export const getAthtleteAtEventsByContingentRegistrationId = async (
  contingentRegistrationId: number
) => {
  try {
    const { message } = await apiProtect({ loggedInOnly: true });
    if (message) throw new Error(message);

    const { data: athleteAtEvents } = await supabase
      .rpc("get_athlete_at_events_by_contingent_registration_id", {
        cont_reg_id: contingentRegistrationId,
      })
      .returns<AthleteAtEvent[]>();

    return athleteAtEvents || [];
  } catch (error) {
    throw error;
  }
};

export const addAthleteAtEventSql = async (
  athletAtEventSql: AthleteAtEventSql
) => {
  try {
    const { message } = await apiProtect({
      loggedInOnly: true,
    });
    if (message) throw new Error(message);

    const dataToSend: any = athletAtEventSql;
    delete dataToSend.registration_id;

    const { error, data } = await supabase
      .from("athlete_at_events")
      .insert(dataToSend)
      .select()
      .returns<AthleteAtEventSql[]>();

    if (error) throw error;
    return data[0];
  } catch (error) {
    throw error;
  }
};

export const updateAthleteAtEventSql = async (
  athletAtEventSql: AthleteAtEventSql
) => {
  try {
    const { message } = await apiProtect({
      loggedInOnly: true,
    });
    if (message) throw new Error(message);

    const { error } = await supabase
      .from("athlete_at_events")
      .update(athletAtEventSql)
      .eq("registration_id", athletAtEventSql.registration_id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

export const updateAthleteAtEventsSql = async (
  athletAtEventsSql: AthleteAtEventSql[]
) => {
  try {
    if (!athletAtEventsSql.length) return;

    const updatePromises = athletAtEventsSql.map((item) =>
      updateAthleteAtEventSql(item)
    );

    await Promise.all(updatePromises);
  } catch (error) {
    throw error;
  }
};

export const deleteAthleteAtEventSql = async (
  athletAtEventSql: AthleteAtEventSql
) => {
  try {
    const { message } = await apiProtect({
      loggedInOnly: true,
    });
    if (message) throw new Error(message);

    const { error } = await supabase
      .from("athlete_at_events")
      .delete()
      .eq("registration_id", athletAtEventSql.registration_id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// OTHERS
export const countDuplicateMatch = async (
  athleteAtEvent: AthleteAtEvent,
  paid: boolean
) => {
  try {
    let func = "count_duplicate_art_match_by_championship_id";
    if (
      athleteAtEvent.type == matchType[0] ||
      athleteAtEvent.category.includes("Tunggal")
    )
      func = "count_duplicate_fight_match_by_championship_id";

    let getCount = supabase.rpc(func, {
      champ_id: athleteAtEvent.championship_id,
      scm: athleteAtEvent.schema,
      tp: athleteAtEvent.type,
      lvl: athleteAtEvent.level,
      ctgr: athleteAtEvent.category,
      pd: paid,
    });

    const { data } = await getCount;

    // console.log({ data });
    return data as number;
  } catch (error) {
    throw error;
  }
};
