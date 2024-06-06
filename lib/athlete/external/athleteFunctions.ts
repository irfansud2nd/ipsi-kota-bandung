import { toast } from "sonner";
import {
  AthleteAtEvent,
  Athlete,
  matchType,
  MatchBased,
} from "./athleteConstants";
import { v4 } from "uuid";
import {
  Contingent,
  ContingentAtEvent,
} from "@/lib/contingent/contingentConstants";
import { getFileUrl } from "@/lib/functions";
import { sendFile, toastError } from "@/lib/form/formFunctions";
import axios from "axios";
import {
  managePersonOnContingent,
  managePersonOnRegisteredContingent,
} from "@/lib/contingent/contingentFunctions";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Championship } from "@/lib/event/eventConstants";

export const calculateAge = (date: any) => {
  const birthDate = new Date(date);
  const currentDate = new Date();
  currentDate.getTime();
  let age: Date = new Date(currentDate.getTime() - birthDate.getTime());
  return age.getFullYear() - 1970;
};

export const addAthlete = async (
  athleteData: Athlete,
  contingentData: Contingent
) => {
  const toastId = toast.loading("Mendaftarkan Atlet");
  const id = v4();

  let contingent: Contingent = contingentData;
  let athlete: Athlete = { ...athleteData, id };
  athlete.createdAt = Date.now();

  const { imageUrl, ktpUrl, kkUrl } = getFileUrl("athlete", id);

  try {
    if (!athlete.createdBy) {
      throw { message: "Email pendaftar tidak ditemukan" };
    }
    if (!athlete.contingentId)
      throw { message: "ID Kontingen tidak ditemukan" };
    if (!athlete.contingentName)
      throw { message: "Nama Kontingen tidak ditemukan" };
    if (!athlete.image.file) throw { message: "Pas foto tidak ditemukan" };
    // if (!athlete.ktp.file) throw { message: "KTP tidak ditemukan" };
    if (!athlete.kk.file) throw { message: "KK tidak ditemukan" };

    // SEND IMAGE
    toast.loading("Mengunggah pas foto atlet", { id: toastId });
    athlete.image.downloadUrl = await sendFile(athlete.image.file, imageUrl);
    delete athlete.image.file;

    // // SEND KTP
    // toast.loading("Mengunggah KTP", { id: toastId });
    // athlete.ktp.downloadUrl = await sendFile(athlete.ktp.file, ktpUrl);
    // delete athlete.ktp.file;

    // SEND KK
    toast.loading("Mengunggah KK", { id: toastId });
    athlete.kk.downloadUrl = await sendFile(athlete.kk.file, kkUrl);
    delete athlete.kk.file;

    // ADD ATHLETE TO CONTINGENT
    toast.loading("Menambahkan atlet ke kontingen", { id: toastId });
    contingent = await managePersonOnContingent(contingent, athlete, "add");

    // SEND ATHLETE
    toast.loading("Mendaftarkan atlet", { id: toastId });
    await axios.post("/api/athlete", athlete);
    toast.success("Atlet berhasil didaftarkan", { id: toastId });
    return { athlete, contingent };
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

export const getAthletes = async (championshipId: string) => {
  try {
    const res = await axios.get(
      `/api/athlete/registered?championshipId=${championshipId}`
    );
    const { athletes, athleteAtEvents } = res.data.result as {
      athletes: Athlete[];
      athleteAtEvents: AthleteAtEvent[];
    };

    return { athletes, athleteAtEvents };
  } catch (error) {
    toastError(error);
    throw error;
  }
};

export const addAthleteAtEvent = async (
  athleteAtEvent: AthleteAtEvent,
  contingentAtEvent: ContingentAtEvent
) => {
  let data: AthleteAtEvent = { ...athleteAtEvent, registeredAt: Date.now() };

  const toastId = toast.loading("Mendaftarkan pertandingan");
  try {
    // SEND ATHLETE AT EVENT
    const dataToSend: any = data;

    delete dataToSend.registrationId;
    delete dataToSend.height;
    delete dataToSend.weight;

    const res = await axios.post("/api/athlete/registered", dataToSend);
    data = res.data.result[0];

    // UPDATE REGISTERED CONTINGENT
    const updatedContingentAtEvent = await managePersonOnRegisteredContingent(
      contingentAtEvent,
      athleteAtEvent,
      "add"
    );

    toast.success("Pertandingan berhasil didaftarkan", { id: toastId });
    return {
      athleteAtEvent: data,
      contingentAtEvent: updatedContingentAtEvent,
    };
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

export const updateAthleteAtEvent = async (
  prevAthleteAtEvent: AthleteAtEvent,
  athleteAtEvent: AthleteAtEvent,
  contingentAtEvent: ContingentAtEvent
) => {
  let data: AthleteAtEvent = { ...athleteAtEvent };

  const toastId = toast.loading("Memperharui pertandingan");
  try {
    // SEND ATHLETE AT EVENT
    const dataToSend: any = data;
    delete dataToSend.height;
    delete dataToSend.weight;

    await axios.patch("/api/athlete/registered", dataToSend);

    // UPDATE REGISTERED CONTINGENT
    const updatedContingentAtEvent = await managePersonOnRegisteredContingent(
      contingentAtEvent,
      athleteAtEvent,
      "update",
      prevAthleteAtEvent
    );

    toast.success("Pertandingan berhasil diperbaharui", { id: toastId });
    return {
      athleteAtEvent: data,
      contingentAtEvent: updatedContingentAtEvent,
    };
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

export const deleteAthleteAtEvent = async (
  athleteAtEvent: AthleteAtEvent,
  contingentAtEvent: ContingentAtEvent
) => {
  const toastId = toast.loading("Menghapus pertandingan");
  try {
    // DELETE ATHLETE AT EVENT
    await axios.delete(
      `/api/athlete/registered?registrationId=${athleteAtEvent.registrationId}&athleteId=${athleteAtEvent.athleteId}`
    );

    // UPDATE REGISTERED CONTINGENT
    const updatedContingentAtEvent = await managePersonOnRegisteredContingent(
      contingentAtEvent,
      athleteAtEvent,
      "delete"
    );

    toast.success("Pertandingan berhasil dihapus", { id: toastId });

    return updatedContingentAtEvent;
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

export const getMatchCost = (athleteAtEvent: AthleteAtEvent) => {
  let result = 0;
  const { matchCost } = getChampionship(
    athleteAtEvent.championshipId
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

export const matchBasedToAthleteAtEvent = (matchBased: MatchBased) => {
  let result: AthleteAtEvent = {
    registrationId: matchBased.registrationId,
    athleteId: matchBased.athleteId,
    championshipId: matchBased.championshipId,
    schema: matchBased.schema,
    type: matchBased.type,
    level: matchBased.level,
    category: matchBased.category,
    team: matchBased.team,
    paymentId: matchBased.paymentId,
    registeredAt: matchBased.registeredAt,
  };

  return result;
};
