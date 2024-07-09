import { toast } from "sonner";
import {
  AthleteAtEvent,
  Athlete,
  matchType,
  MatchBased,
  AthleteSql,
  AthleteAtEventSql,
  matchSchema,
} from "./athleteConstants";
import { v4 } from "uuid";
import { getFileUrl } from "@/lib/functions";
import { sendFile, toastError } from "@/lib/form/formFunctions";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Championship, MatchCategory } from "@/lib/event/eventConstants";
import {
  addAthleteAtEventSql,
  addAthleteSql,
  countDuplicateMatch,
  deleteAthleteAtEventSql,
  deleteAthleteSql,
  getAthletesSql,
  getAthletesSqlByContingentId,
  updateAthleteAtEventSql,
  updateAthleteAtEventsSql,
  updateAthleteSql,
} from "./athleteActions";
import { apiProtect } from "@/lib/admin/adminActions";
import { deleteFile } from "@/lib/actions";

// ATHLETE
// CREATE
export const addAthlete = async (athleteData: Athlete) => {
  const toastId = toast.loading("Mendaftarkan Atlet");
  const id = v4();

  let athlete: Athlete = { ...athleteData, id };
  athlete.created_at = Date.now();

  const { imageUrl, kkUrl } = getFileUrl("athlete", id);

  try {
    if (!athlete.contingent_id)
      throw { message: "ID Kontingen tidak ditemukan" };
    if (!athlete.contingent_name)
      throw { message: "Nama Kontingen tidak ditemukan" };
    if (!athlete.image.file) throw { message: "Pas foto tidak ditemukan" };
    if (!athlete.kk.file) throw { message: "KK tidak ditemukan" };

    const response = await apiProtect();
    if (response) throw response;

    // SEND IMAGE
    toast.loading("Mengunggah pas foto atlet", { id: toastId });
    athlete.image.downloadUrl = await sendFile(athlete.image.file, imageUrl);
    delete athlete.image.file;

    // SEND KK
    toast.loading("Mengunggah KK", { id: toastId });
    athlete.kk.downloadUrl = await sendFile(athlete.kk.file, kkUrl);
    delete athlete.kk.file;

    // SEND ATHLETE
    toast.loading("Mendaftarkan atlet", { id: toastId });
    const { error } = await addAthleteSql(athleteToAthleteSql(athlete));
    if (error) throw error;

    // FINISH
    toast.success("Atlet berhasil didaftarkan", { id: toastId });
    return athlete;
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// READ
export const getAthletes = async (
  page: number,
  limit: number,
  showAll: boolean = false
) => {
  try {
    const response = await apiProtect({ directory: "athlete" });
    if (response) throw new Error(response.message);

    const { result: athletesSql, error } = await getAthletesSql(
      page,
      limit,
      showAll
    );
    if (error) throw error;

    const athletes = athletesSql.map((athleteSql) =>
      athleteSqlToAthlete(athleteSql)
    );

    return athletes;
  } catch (error) {
    throw error;
  }
};

export const getAthletesByContingentId = async (contingentId: string) => {
  try {
    const response = await apiProtect();
    if (response) throw response;

    const { result: athletesSql, error } = await getAthletesSqlByContingentId(
      contingentId
    );
    if (error) throw error;

    const athletes = athletesSql.map((athleteSql) =>
      athleteSqlToAthlete(athleteSql)
    );

    return athletes;
  } catch (error) {
    throw error;
  }
};

// UPDATE
export const updateAthlete = async (athlete: Athlete) => {
  const toastId = toast.loading("Memperbahrui atlet");
  const { imageUrl, kkUrl } = getFileUrl("athlete", athlete.id);

  try {
    const response = await apiProtect();
    if (response) throw response;

    if (athlete.image.file) {
      // UPDATE IMAGE
      toast.loading("Memperbaharui pas foto atlet", { id: toastId });
      athlete.image.downloadUrl = await sendFile(athlete.image.file, imageUrl);
      delete athlete.image.file;
    }

    if (athlete.kk.file) {
      // UPDATE KK
      toast.loading("Memperbaharui KK atlet", { id: toastId });
      athlete.kk.downloadUrl = await sendFile(athlete.kk.file, kkUrl);
      delete athlete.kk.file;
    }

    // UPDATE ATHLETE
    toast.loading("Memperbaharui atlet", { id: toastId });
    const { error } = await updateAthleteSql(athleteToAthleteSql(athlete));
    if (error) throw error;

    // FINISH
    toast.success("Atlet berhasil diperbaharui", { id: toastId });
    return athlete;
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// DELETE
export const deleteAthlete = async (athlete: Athlete) => {
  const toastId = toast.loading("Menghapus Atlet");

  const { imageUrl, kkUrl } = getFileUrl("athlete", athlete.id);

  try {
    const response = await apiProtect();
    if (response) throw response;

    // DELETE IMAGE
    toast.loading("Menghapus pas foto atlet", { id: toastId });
    const { error: deleteImageError } = await deleteFile(imageUrl);
    if (deleteImageError) throw deleteImageError;

    // DELETE KK
    toast.loading("Menghapus KK", { id: toastId });
    const { error: deleteKkError } = await deleteFile(kkUrl);
    if (deleteKkError) throw deleteKkError;

    // DELETE ATHLETE
    toast.loading("Menghapus atlet", { id: toastId });
    const { error: deleteAthleteSqlError } = await deleteAthleteSql(
      athleteToAthleteSql(athlete)
    );
    if (deleteAthleteSqlError) throw deleteAthleteSqlError;

    // FINISH
    toast.success("Atlet berhasil dihapus", { id: toastId });
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

// ATHLETE AT EVENT
// CREATE
export const addAthleteAtEvent = async (athleteAtEvent: AthleteAtEvent) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { result: athleteAtEventSql, error } = await addAthleteAtEventSql(
      athleteAtEventToAhthleteAtEventSql(athleteAtEvent)
    );
    if (error) throw error;

    const result: AthleteAtEvent = {
      ...athleteAtEventSql,
      championship_id: athleteAtEvent.championship_id,
    };
    return result;
  } catch (error) {
    throw error;
  }
};

// UPDATE
export const updateAthleteAtEvent = async (athleteAtEvent: AthleteAtEvent) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { error } = await updateAthleteAtEventSql(
      athleteAtEventToAhthleteAtEventSql(athleteAtEvent)
    );
    if (error) throw error;

    return athleteAtEvent;
  } catch (error) {
    throw error;
  }
};

export const updateAthleteAtEvents = async (
  athleteAtEvents: AthleteAtEvent[]
) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { error } = await updateAthleteAtEventsSql(
      athleteAtEvents.map((item) => athleteAtEventToAhthleteAtEventSql(item))
    );
    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// DELETE
export const deleteAthleteAtEvent = async (athleteAtEvent: AthleteAtEvent) => {
  try {
    const response = await apiProtect({
      loggedInOnly: true,
    });
    if (response) throw response;

    const { error } = await deleteAthleteAtEventSql(
      athleteAtEventToAhthleteAtEventSql(athleteAtEvent)
    );
    if (error) throw error;
  } catch (error) {
    throw error;
  }
};

// OTHERS
export const getMatchCost = (athleteAtEvent: AthleteAtEvent) => {
  let result = 0;
  const { matchCost } = getChampionship(
    athleteAtEvent.championship_id
  ) as Championship;
  if (athleteAtEvent.type == matchType[0]) {
    result = matchCost.tanding;
  } else {
    if (athleteAtEvent.category.includes("Tunggal")) result = matchCost.tunggal;
    if (athleteAtEvent.category.includes("Ganda")) result = matchCost.ganda;
    if (athleteAtEvent.category.includes("Regu")) result = matchCost.regu;
  }

  return result;
};

export const getMatchCostByCategory = (
  category: string,
  championship: Championship
) => {
  let result = 0;
  const { matchCost } = championship;

  if (category.includes("Tunggal")) {
    result = matchCost.tunggal;
  } else if (category.includes("Ganda")) {
    result = matchCost.ganda;
  } else if (category.includes("Regu")) {
    result = matchCost.regu;
  } else {
    result = matchCost.tanding;
  }
  return result;
};

export const getTotalMatchCost = (athleteAtEvents: AthleteAtEvent[]) => {
  let result = 0;
  athleteAtEvents.map((item) => (result += getMatchCost(item)));
  return result;
};

export const calculateAge = (date: any) => {
  const birthDate = new Date(date);
  const currentDate = new Date();
  currentDate.getTime();
  let age: Date = new Date(currentDate.getTime() - birthDate.getTime());
  return age.getFullYear() - 1970;
};

export const matchBasedToAthleteAtEvent = (matchBased: MatchBased) => {
  let result: AthleteAtEvent = {
    registration_id: matchBased.registration_id,
    athlete_id: matchBased.athlete_id,
    championship_id: matchBased.championship_id,
    contingent_registration_id: matchBased.contingent_registration_id,
    schema: matchBased.schema,
    type: matchBased.type,
    level: matchBased.level,
    category: matchBased.category,
    team: matchBased.team,
    payment_id: matchBased.payment_id,
    registered_at: matchBased.registered_at,
    payment_bill: matchBased.payment_bill,
  };

  return result;
};

export const athleteSqlToAthlete = (athleteSql: AthleteSql) => {
  const result: Athlete = {
    ...athleteSql,
    image: {
      downloadUrl: athleteSql.image,
    },
    kk: {
      downloadUrl: athleteSql.kk,
    },
  };
  return result;
};

export const athleteToAthleteSql = (athlete: Athlete) => {
  const result: AthleteSql = {
    ...athlete,
    image: athlete.image.downloadUrl,
    kk: athlete.kk.downloadUrl,
  };
  return result;
};

export const athleteAtEventToAhthleteAtEventSql = (
  athletAtEvent: AthleteAtEvent
) => {
  const result: AthleteAtEventSql = {
    registration_id: athletAtEvent.registration_id,
    athlete_id: athletAtEvent.athlete_id,
    contingent_registration_id: athletAtEvent.contingent_registration_id,
    schema: athletAtEvent.schema,
    type: athletAtEvent.type,
    level: athletAtEvent.level,
    category: athletAtEvent.category,
    team: athletAtEvent.team,
    payment_id: athletAtEvent.payment_id,
    payment_bill: athletAtEvent.payment_bill,
    registered_at: athletAtEvent.registered_at,
  };
  return result;
};

export const getMatchCategory = (
  level: string,
  type: string,
  matchCategory: MatchCategory
) => {
  const categories = matchCategory.find(
    (item) => item.level == level
  )?.category;
  const result = type == matchType[0] ? categories?.fight : categories?.art;
  return result ?? [];
};

export const getLevel = (rookie: boolean, matchCategory: MatchCategory) => {
  const allLevels = matchCategory.map((item) => item.level);
  const professionalLevels = matchCategory
    .filter((item) => item.rookieOnly != true)
    .map((item) => item.level);

  return rookie ? allLevels : professionalLevels;
};

export const isMatchSame = (item1: MatchBased, item2: MatchBased) => {
  return (
    item1.gender == item2.gender &&
    item1.schema == item2.schema &&
    item1.type == item2.type &&
    item1.level == item2.level &&
    item1.category == item2.category &&
    item1.team == item2.team
  );
};

export const isNewTeam = (
  MatchBaseds: MatchBased[],
  MatchBased: MatchBased,
  paid: boolean
) => {
  if (MatchBased.type == matchType[0]) return false;
  if (MatchBased.category.includes("Tunggal")) return false;

  let registered = MatchBaseds.filter((item) => isMatchSame(item, MatchBased));
  if (!registered.length) return true;

  if (paid) registered = registered.filter((item) => item.payment_id);

  return registered.length < 1;
};

export const checkMatchBasedLimited = async (
  matchBaseds: MatchBased[],
  matchBased: MatchBased,
  championship: Championship
) => {
  if (matchBased.schema == matchSchema[0]) return;

  const limit = championship.matchCategory.find(
    (item) => item.level == matchBased.level
  )?.limit;
  if (!limit) return;

  let countLimit = limit.tanding;
  if (matchBased.category.includes("Ganda")) {
    countLimit = limit.ganda;
    if (!isNewTeam(matchBaseds, matchBased, limit.paid)) countLimit += 1;
  }
  if (matchBased.category.includes("Regu")) {
    countLimit = limit.regu;
    if (!isNewTeam(matchBaseds, matchBased, limit.paid)) countLimit += 1;
  }
  if (matchBased.category.includes("Tunggal")) countLimit = limit.tunggal;

  try {
    const { result: count, error: countError } = await countDuplicateMatch(
      matchBased,
      limit.paid
    );
    if (countError) throw countError;

    if (getChampionship(matchBased.championship_id)?.reserveForPal) {
      const { result: palCount, error: palCountError } =
        await countDuplicateMatch(matchBased, limit.paid, true);
      if (palCountError) throw palCountError;

      if (
        !matchBased.contingent_name.includes("PAL KOTA BANDUNG") &&
        count < countLimit &&
        palCount < 1
      ) {
        countLimit -= 1;
      }
    }

    // console.log({ count, countLimit });

    if (count < countLimit) return;
    return `Kuota pertandingan untuk kategori yang anda pilih telah penuh (${countLimit} atlet), silahkan ubah ke kategori Pemula`;
  } catch (error: any) {
    return error.message as string;
  }
};

export const checkAthleteAtEventsLimited = async (
  matchBasedsToCheck: MatchBased[],
  allMatchBaseds: MatchBased[],
  championship: Championship
) => {
  try {
    if (!matchBasedsToCheck.length) return;

    for (const matchBasedToCheck of matchBasedsToCheck) {
      const result = await checkMatchBasedLimited(
        allMatchBaseds,
        matchBasedToCheck,
        championship
      );
      if (result) {
        return matchBasedToCheck.registration_id;
      }
    }
  } catch (error) {
    throw error;
  }
};
