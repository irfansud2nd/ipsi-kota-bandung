"use server";
import { apiProtect } from "@/lib/admin/adminActions";
import supabase from "@/lib/database/supabase";
import {
  AthleteAtEvent,
  AthleteAtEventSql,
  AthleteSql,
  MatchBased,
  matchType,
} from "./athleteConstants";
import { athleteSqlToAthlete } from "./athleteFunctions";

// ATHLETE SQL
// GET
export const getAthletesSqlByEmail = async (email: string) => {
  try {
    const response = await apiProtect({ permittedEmail: email });
    if (response) throw response;

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

export const getAthletesSql = async (
  page: number,
  limit: number,
  showAll: boolean = false
) => {
  try {
    const response = await apiProtect({ directory: "athlete" });
    if (response) throw response;

    let getData = supabase.from("athletes").select().returns<AthleteSql[]>();

    if (!showAll)
      getData = getData.range(page * limit - limit, page * limit - 1);

    const { data, error } = await getData;

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

// CREATE
export const addAthleteSql = async (athleteSql: AthleteSql) => {
  try {
    const response = await apiProtect({
      permittedEmail: athleteSql.created_by,
    });
    if (response) throw response;

    const { error } = await supabase.from("athletes").insert(athleteSql);

    if (error) throw error;

    return athleteSql;
  } catch (error) {
    throw error;
  }
};

// UPDATE
export const updateAthleteSql = async (athleteSql: AthleteSql) => {
  try {
    const response = await apiProtect({
      permittedEmail: athleteSql.created_by,
    });
    if (response) throw response;

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

// UPDATE
export const deleteAthleteSql = async (athleteSql: AthleteSql) => {
  try {
    const response = await apiProtect({
      permittedEmail: athleteSql.created_by,
    });
    if (response) throw response;

    const { error } = await supabase
      .from("athletes")
      .delete()
      .eq("id", athleteSql.id);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// ATHLETE
// READ
export const getAthletes = async (
  page: number,
  limit: number,
  showAll: boolean = false
) => {
  try {
    const response = await apiProtect({ directory: "athlete" });
    if (response) throw response;

    const athletesSql = await getAthletesSql(page, limit, showAll);
    const athletes = athletesSql.map((athleteSql) =>
      athleteSqlToAthlete(athleteSql)
    );

    return athletes;
  } catch (error) {
    throw error;
  }
};

// MATCH BASED
// READ
export const getMatchBaseds = async (
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
      .rpc("get_match_based_by_championship_id", params)
      .returns<MatchBased[]>();

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};
export const getMatchBasedsByCategory = async (
  championshipId: string,
  schema: string,
  type: string,
  level: string,
  category: string,
  gender: string,
  page: number,
  limit: number,
  showAll: boolean = false
) => {
  try {
    const response = await apiProtect({ directory: "championship" });
    if (response) throw response;

    let params = {
      champ_id: championshipId,
      scm: schema,
      tp: type,
      lvl: level,
      ctgr: category,
      gdr: gender,
      pg: page,
      lmt: limit,
    };

    if (showAll) {
      params.pg = 1;
      params.lmt = 4000;
    }

    const { data, error } = await supabase
      .rpc("get_match_based_by_category", params)
      .returns<MatchBased[]>();

    if (error) throw error;

    return data;
  } catch (error) {
    throw error;
  }
};

// ATHLETE AT EVENTS
// READ
export const getAthtleteAtEventsByContingentRegistrationId = async (
  contingentRegistrationId: number
) => {
  try {
    const response = await apiProtect({ loggedInOnly: true });
    if (response) throw response;

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

// CREATE
export const addAthleteAtEventSql = async (
  athletAtEventSql: AthleteAtEventSql
) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

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

// UPDATE
export const updateAthleteAtEventSql = async (
  athletAtEventSql: AthleteAtEventSql
) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

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

// DELETE
export const deleteAthleteAtEventSql = async (
  athletAtEventSql: AthleteAtEventSql
) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

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
export const countAthleteByContingentId = async (contingentId: string) => {
  try {
    const { count, error } = await supabase
      .from("athletes")
      .select("id", { count: "exact", head: true })
      .eq("contingent_id", contingentId);

    if (error) throw new Error(error.message);

    return count || 0;
  } catch (error) {
    throw error;
  }
};

export const countAthlete = async () => {
  try {
    const { count, error } = await supabase
      .from("athletes")
      .select("id", { count: "exact", head: true });

    if (error) throw error;

    return count || 0;
  } catch (error) {
    throw error;
  }
};

export const countDuplicateMatch = async (
  matchBased: MatchBased,
  paid: boolean
) => {
  try {
    let func = "count_duplicate_art_match_by_championship_id";
    if (
      matchBased.type == matchType[0] ||
      matchBased.category.includes("Tunggal")
    )
      func = "count_duplicate_fight_match_by_championship_id";

    let getCount = supabase.rpc(func, {
      champ_id: matchBased.championship_id,
      scm: matchBased.schema,
      tp: matchBased.type,
      lvl: matchBased.level,
      ctgr: matchBased.category,
      gdr: matchBased.gender,
      pd: paid,
    });

    const { data } = await getCount;

    return data as number;
  } catch (error) {
    throw error;
  }
};

export const countMatchByChampionshipId = async (championshipId: string) => {
  try {
    const { data, error } = await supabase
      .rpc("count_match_by_championship_id", { champ_id: championshipId })
      .returns<number>();

    if (error) throw error;

    return data || 0;
  } catch (error) {
    throw error;
  }
};

export const countAthleteByChampionshipId = async (championshipId: string) => {
  try {
    const { data, error } = await supabase
      .rpc("count_athlete_by_championship_id", { champ_id: championshipId })
      .returns<number>();

    if (error) throw error;

    return data || 0;
  } catch (error) {
    throw error;
  }
};

export const countProfessionalMatches = async (
  matches: {
    championshipId: string;
    schema: string;
    type: string;
    level: string;
    category: string;
    gender: string;
    paid: boolean;
  }[]
) => {
  try {
    if (!matches.length) return [];

    const countPromises = matches.map(async (match) => {
      let func = "count_duplicate_art_match_by_championship_id";
      if (match.type == matchType[0] || match.category.includes("Tunggal"))
        func = "count_duplicate_fight_match_by_championship_id";

      const { data, error } = await supabase
        .rpc(func, {
          champ_id: match.championshipId,
          scm: match.schema,
          tp: match.type,
          lvl: match.level,
          ctgr: match.category,
          gdr: match.gender,
          pd: match.paid,
        })
        .returns<number>();

      if (error) throw error;
      return {
        ...match,
        count: data || 0,
      };
    });

    const counts = await Promise.all(countPromises);
    return counts;
  } catch (error) {
    throw error;
  }
};
