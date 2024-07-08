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
import { ServerAction } from "@/lib/constants";
import { action } from "@/lib/functions";
import { cache } from "react";

// ATHLETE SQL
// CREATE
export const addAthleteSql = async (
  athleteSql: AthleteSql
): Promise<ServerAction<AthleteSql>> => {
  try {
    const response = await apiProtect({
      permittedEmail: athleteSql.created_by,
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase.from("athletes").insert(athleteSql);

    if (error) throw new Error(error.message);

    return action.success(athleteSql);
  } catch (error) {
    return action.error(error);
  }
};

// READ
export const getAthletesSqlByEmail = async (
  email: string
): Promise<ServerAction<AthleteSql[]>> => {
  try {
    const response = await apiProtect({ permittedEmail: email });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .from("athletes")
      .select()
      .eq("created_by", email)
      .returns<AthleteSql[]>();

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const getAthletesSql = async (
  page: number,
  limit: number,
  showAll: boolean = false
): Promise<ServerAction<AthleteSql[]>> => {
  try {
    const response = await apiProtect({ directory: "athlete" });
    if (response) throw new Error(response.message);

    let getData = supabase.from("athletes").select().returns<AthleteSql[]>();

    if (!showAll)
      getData = getData.range(page * limit - limit, page * limit - 1);

    const { data, error } = await getData;

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const getAthletesSqlByContingentId = async (
  contingentId: string
): Promise<ServerAction<AthleteSql[]>> => {
  try {
    const response = await apiProtect({ directory: "athlete" });
    if (response) throw new Error(response.message);

    const { data, error } = await supabase
      .from("athletes")
      .select()
      .eq("contingent_id", contingentId)
      .returns<AthleteSql[]>();

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

// UPDATE
export const updateAthleteSql = async (
  athleteSql: AthleteSql
): Promise<ServerAction<AthleteSql>> => {
  try {
    const response = await apiProtect({
      permittedEmail: athleteSql.created_by,
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("athletes")
      .update(athleteSql)
      .eq("id", athleteSql.id);

    if (error) throw new Error(error.message);

    return action.success(athleteSql);
  } catch (error) {
    return action.error(error);
  }
};

// DELETE
export const deleteAthleteSql = async (
  athleteSql: AthleteSql
): Promise<ServerAction<AthleteSql>> => {
  try {
    const response = await apiProtect({
      permittedEmail: athleteSql.created_by,
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("athletes")
      .delete()
      .eq("id", athleteSql.id);

    if (error) throw new Error(error.message);

    return action.success(athleteSql);
  } catch (error) {
    return action.error(error);
  }
};

// MATCH BASED
// READ
export const getMatchBaseds = cache(
  async (
    championshipId: string,
    page: number,
    limit: number,
    showAll: boolean = false
  ): Promise<ServerAction<MatchBased[]>> => {
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
        .rpc("get_match_based_by_championship_id", params)
        .returns<MatchBased[]>();

      if (error) throw new Error(error.message);

      return action.success(data);
    } catch (error) {
      return action.error(error);
    }
  }
);

export const getMatchBasedsByCategory = cache(
  async (
    championshipId: string,
    schema: string,
    type: string,
    level: string,
    category: string,
    gender: string,
    page: number,
    limit: number,
    showAll: boolean = false
  ): Promise<ServerAction<MatchBased[]>> => {
    try {
      const response = await apiProtect({ directory: "championship" });
      if (response) throw new Error(response.message);

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

      if (error) throw new Error(error.message);

      return action.success(data);
    } catch (error) {
      return action.error(error);
    }
  }
);

export const getMatchBasedsByPaymentId = cache(
  async (paymentId: string): Promise<ServerAction<MatchBased[]>> => {
    try {
      const response = await apiProtect({ directory: "championship" });
      if (response) throw new Error(response.message);

      const { data, error } = await supabase
        .rpc("get_match_based_by_payment_id", {
          pay_id: paymentId,
        })
        .returns<MatchBased[]>();

      if (error) throw new Error(error.message);

      return action.success(data);
    } catch (error) {
      return action.error(error);
    }
  }
);

export const getMatchBasedsByContingentRegistrationId = cache(
  async (
    contingentRegistrationId: number
  ): Promise<ServerAction<MatchBased[]>> => {
    try {
      const response = await apiProtect({ directory: "championship" });
      if (response) throw new Error(response.message);

      const { data, error } = await supabase
        .rpc("get_match_based_by_contingen_registration_id", {
          cont_reg_id: contingentRegistrationId,
        })
        .returns<MatchBased[]>();

      if (error) throw new Error(error.message);

      return action.success(data);
    } catch (error) {
      return action.error(error);
    }
  }
);

// ATHLETE AT EVENTS
// CREATE
export const addAthleteAtEventSql = async (
  athletAtEventSql: AthleteAtEventSql
): Promise<ServerAction<AthleteAtEventSql>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const dataToSend: any = athletAtEventSql;
    delete dataToSend.registration_id;

    const { error, data } = await supabase
      .from("athlete_at_events")
      .insert(dataToSend)
      .select()
      .returns<AthleteAtEventSql[]>();

    if (error) throw new Error(error.message);
    return action.success(data[0]);
  } catch (error) {
    return action.error(error);
  }
};

// READ
export const getAthtleteAtEventsByContingentRegistrationId = async (
  contingentRegistrationId: number
): Promise<ServerAction<AthleteAtEvent[]>> => {
  try {
    const response = await apiProtect({ loggedInOnly: true });
    if (response) throw new Error(response.message);

    const { data: athleteAtEvents } = await supabase
      .rpc("get_athlete_at_events_by_contingent_registration_id", {
        cont_reg_id: contingentRegistrationId,
      })
      .returns<AthleteAtEvent[]>();

    return action.success(athleteAtEvents || []);
  } catch (error) {
    return action.error(error);
  }
};

// UPDATE
export const updateAthleteAtEventSql = async (
  athletAtEventSql: AthleteAtEventSql
): Promise<ServerAction<AthleteAtEventSql>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("athlete_at_events")
      .update(athletAtEventSql)
      .eq("registration_id", athletAtEventSql.registration_id);

    if (error) throw new Error(error.message);

    return action.success(athletAtEventSql);
  } catch (error) {
    return action.error(error);
  }
};

export const updateAthleteAtEventsSql = async (
  athletAtEventsSql: AthleteAtEventSql[]
): Promise<ServerAction<string>> => {
  try {
    if (athletAtEventsSql.length) {
      const updatePromises = athletAtEventsSql.map(async (item) => {
        const { error } = await updateAthleteAtEventSql(item);
        if (error) throw error;
      });

      await Promise.all(updatePromises);
    }
    return action.success("success");
  } catch (error) {
    return action.error(error);
  }
};

// DELETE
export const deleteAthleteAtEventSql = async (
  athletAtEventSql: AthleteAtEventSql
): Promise<ServerAction<AthleteAtEventSql>> => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw new Error(response.message);

    const { error } = await supabase
      .from("athlete_at_events")
      .delete()
      .eq("registration_id", athletAtEventSql.registration_id);

    if (error) throw new Error(error.message);

    return action.success(athletAtEventSql);
  } catch (error) {
    return action.error(error);
  }
};

// OTHERS
export const countAthlete = async (): Promise<ServerAction<number>> => {
  try {
    const { count, error } = await supabase
      .from("athletes")
      .select("id", { count: "exact", head: true });

    if (error) throw new Error(error.message);

    return action.success(count || 0);
  } catch (error) {
    return action.error(error);
  }
};

export const countDuplicateMatch = async (
  matchBased: MatchBased,
  paid: boolean
): Promise<ServerAction<number>> => {
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

    const { data, error } = await getCount.returns<number>();

    if (error) throw new Error(error.message);

    return action.success(data);
  } catch (error) {
    return action.error(error);
  }
};

export const countMatchByChampionshipId = async (
  championshipId: string
): Promise<ServerAction<number>> => {
  try {
    const { data, error } = await supabase
      .rpc("count_match_by_championship_id", { champ_id: championshipId })
      .returns<number>();

    if (error) throw new Error(error.message);

    return action.success(data || 0);
  } catch (error) {
    return action.error(error);
  }
};

export const countAthleteByChampionshipId = async (
  championshipId: string
): Promise<ServerAction<number>> => {
  try {
    const { data, error } = await supabase
      .rpc("count_athlete_by_championship_id", { champ_id: championshipId })
      .returns<number>();

    if (error) throw new Error(error.message);

    return action.success(data || 0);
  } catch (error) {
    return action.error(error);
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
): Promise<
  ServerAction<
    {
      count: number;
      championshipId: string;
      schema: string;
      type: string;
      level: string;
      category: string;
      gender: string;
      paid: boolean;
    }[]
  >
> => {
  try {
    if (!matches.length) return action.success([]);

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

      if (error) throw new Error(error.message);
      return {
        ...match,
        count: data || 0,
      };
    });

    const counts = await Promise.all(countPromises);
    return action.success(counts);
  } catch (error) {
    return action.error(error);
  }
};
