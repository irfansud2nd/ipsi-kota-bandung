import { v4 } from "uuid";
import {
  Contingent,
  ContingentAtEvent,
  RegisteredContingent,
} from "./contingentConstants";
import { toast } from "sonner";
import axios from "axios";
import { toastError } from "../form/formFunctions";
import { Athlete, AthleteAtEvent } from "../athlete/external/athleteConstants";
import { Official } from "../official/officialContants";
import { getMatchCost } from "../athlete/external/athleteFunctions";

export const addContingent = async (
  contingentData: Contingent,
  eventId?: string
) => {
  const id = v4();

  let result: {
    contingent: Contingent;
    contingentAtEvent: ContingentAtEvent | undefined;
    registeredContingent: RegisteredContingent | undefined;
  } = {
    contingent: contingentData,
    contingentAtEvent: undefined,
    registeredContingent: undefined,
  };

  result.contingent = contingentData;
  result.contingent.id = id;
  result.contingent.createdAt = Date.now();

  const toastId = toast.loading("Mendaftarkan Contingent");

  try {
    if (!result.contingent.createdBy)
      throw { message: "Email pendaftar tidak ditemukan" };

    await axios.post("/api/contingent", result.contingent);

    if (eventId) {
      const data = await addRegisteredContingent(
        result.contingent,
        eventId,
        toastId
      );
      result = { ...result, ...data };
    }

    toast.success("Contingent berhasil didaftarkan", { id: toastId });
    return result;
  } catch (error) {
    toastError(error, toastId);
    throw error;
  }
};

export const addRegisteredContingent = async (
  contingent: Contingent,
  championshipId: string,
  prevToastId?: string | number
) => {
  const data: ContingentAtEvent = {
    registrationId: 0,
    contingentId: contingent.id,
    championshipId,
    registeredAthletes: 0,
    registeredOfficials: 0,
    matchCount: 0,
    registeredAt: Date.now(),
    paymentIds: [],
    paymentBill: 0,
    paymentTotal: 0,
  };

  const toastId =
    prevToastId ?? toast.loading("Menambahkan Contingent ke event");

  try {
    const dataToSend: any = data;
    delete dataToSend.registrationId;

    const res = await axios.post("/api/contingent/registered", data);

    const contingentAtEvents: ContingentAtEvent[] = res.data.result;

    !prevToastId &&
      toast.success("Contingent berhasil didaftarkan", { id: toastId });
    return contingentAtEvents;
  } catch (error) {
    !prevToastId && toastError(error, toastId);
    throw error;
  }
};

export const updateRegisteredContingen = async (
  registeredContingent: RegisteredContingent,
  prevToastId?: string | number
) => {
  const toastId = prevToastId ?? toast.loading("Memperbaharui kontingen");
  try {
    const res = await axios.post(
      "/api/contingent/registered",
      registeredContingent
    );

    !prevToastId &&
      toast.success("Kontingen berhasil diperbaharui", { id: toastId });
    return res.data.result as RegisteredContingent;
  } catch (error) {
    !prevToastId && toastError(error, toastId);
    throw error;
  }
};

export const getContingent = async () => {
  try {
    const res = await axios.get("/api/contingent/registered");
    let result = res.data.result as {
      contingent: Contingent;
      contingentAtEvents: ContingentAtEvent[];
    };
    return result;
  } catch (error) {
    toastError(error);
    throw error;
  }
};

export const managePersonOnContingent = async (
  contingent: Contingent,
  person: Athlete | Official,
  action: "add" | "delete"
) => {
  let athlete: Athlete | undefined = undefined;
  let official: Official | undefined = undefined;

  (person as Athlete).birthPlace
    ? (athlete = person as Athlete)
    : (official = person as Official);

  let data: Contingent = contingent;
  const property = athlete ? "athletes" : "officials";

  if (action == "add") data[property] += 1;
  if (action == "delete") data[property] = data[property] -= 1;

  try {
    await axios.patch("/api/contingent", data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const managePersonOnRegisteredContingent = async (
  contingentAtEvent: ContingentAtEvent,
  person: AthleteAtEvent | Official,
  action: "add" | "delete" | "update",
  prevAthleteAtEvent?: AthleteAtEvent
) => {
  let athleteAtEvent: AthleteAtEvent | undefined = undefined;
  let official: Official | undefined = undefined;

  (person as AthleteAtEvent).athleteId
    ? (athleteAtEvent = person as AthleteAtEvent)
    : (official = person as Official);

  let data: ContingentAtEvent = { ...contingentAtEvent };
  const property = athleteAtEvent
    ? "registeredAthletes"
    : "registeredOfficials";

  if (action == "add") data[property] += 1;
  if (action == "delete") data[property] = data[property] -= 1;

  if (athleteAtEvent) {
    if (action == "update" && prevAthleteAtEvent) {
      data.paymentBill -= getMatchCost(prevAthleteAtEvent);
      data.paymentBill += getMatchCost(athleteAtEvent);
    } else if (action == "delete") {
      data.matchCount -= 1;
      data.paymentBill -= getMatchCost(athleteAtEvent);
    } else {
      data.matchCount += 1;
      data.paymentBill += getMatchCost(athleteAtEvent);
    }
  }

  try {
    await axios.patch("/api/contingent/registered", data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getContingentAtEventByChampionshipId = (
  contingentAtEvents: ContingentAtEvent[],
  championshipId: string
) => {
  if (!contingentAtEvents.length || !championshipId) return undefined;
  return contingentAtEvents.find(
    (item) => item.championshipId == championshipId
  );
};
