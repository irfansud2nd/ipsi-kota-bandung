import { v4 } from "uuid";
import {
  Contingent,
  ContingentAtEvent,
  ContingentAtEventSql,
  ContingentSql,
  RegisteredContingent,
} from "./contingentConstants";
import {
  addContingentAtEventSql,
  addContingentSql,
  deleteContingentAtEventSql,
  deleteContingentSql,
  getContingenAtEvents,
  getContingentByEmail,
  updateContingentSql,
} from "./contingentActions";
import { apiProtect } from "../admin/adminActions";

// CONTINGENT
export const updateContingent = async (contingent: Contingent) => {
  try {
    const response = await apiProtect({
      permittedEmail: contingent.created_by,
    });
    if (response) throw response;

    await updateContingentSql(contingentToContingenSql(contingent));

    return contingent;
  } catch (error) {
    throw error;
  }
};

export const deleteContingent = async (contingent: Contingent) => {
  try {
    const response = await apiProtect({
      permittedEmail: contingent.created_by,
    });
    if (response) throw response;

    // DELETE CONTINGENT SQL
    await deleteContingentSql(contingentToContingenSql(contingent));
  } catch (error) {
    throw error;
  }
};

// CONTINGENT AT EVENT
export const addContingentAtEvent = async (
  contingent: Contingent,
  championshipId: string
) => {
  const contingentAtEvent: ContingentAtEvent = {
    registration_id: 0,
    contingent_id: contingent.id,
    championship_id: championshipId,
    registered_athletes: 0,
    registered_officials: 0,
    match_count: 0,
    registered_at: Date.now(),
    payment_ids: [],
    payment_bill: 0,
    payment_total: 0,
  };

  try {
    const response = await addContingentAtEventSql(
      contingentAtEventToContingentAtEventSql(contingentAtEvent)
    );

    const contingentAtEvents: ContingentAtEvent[] = [
      { ...contingentAtEvent, ...response },
    ];

    return contingentAtEvents;
  } catch (error) {
    throw error;
  }
};

export const deleteContingentAtEvent = async (
  contingentAtEvent: ContingentAtEvent
) => {
  try {
    const response = await apiProtect({ loggedInOnly: true });
    if (response) throw response;

    await deleteContingentAtEventSql(
      contingentAtEventToContingentAtEventSql(contingentAtEvent)
    );
  } catch (error) {
    throw error;
  }
};

// CONTINGENT AND CONTINGENT AT EVENT
export const getContingentAtEventByChampionshipId = (
  contingentAtEvents: ContingentAtEvent[],
  championshipId: string
) => {
  if (!contingentAtEvents.length || !championshipId) return undefined;
  return contingentAtEvents.find(
    (item) => item.championship_id == championshipId
  );
};
export const getContingentInfoByEmail = async (email: string) => {
  try {
    const response = await apiProtect({
      permittedEmail: email,
    });
    if (response) throw response;

    let result: {
      contingent: Contingent | undefined;
      contingentAtEvents: ContingentAtEvent[];
    } = {
      contingent: undefined,
      contingentAtEvents: [],
    };

    result.contingent = await getContingentByEmail(email);
    if (!result.contingent) return result;

    result.contingentAtEvents = await getContingenAtEvents(
      result.contingent.id
    );

    return result;
  } catch (error) {
    throw error;
  }
};

export const addContingentAndRegister = async (
  contingentData: Contingent,
  eventId: string
) => {
  const id = v4();

  let contingent = contingentData;

  contingent.id = id;
  contingent.created_at = Date.now();

  try {
    if (!contingent.created_by)
      throw { message: "Email pendaftar tidak ditemukan" };

    await addContingentSql(contingentToContingenSql(contingent));

    const contingentAtEvents = await addContingentAtEvent(contingent, eventId);

    return { contingent, contingentAtEvents };
  } catch (error) {
    throw error;
  }
};

// OTHERS
export const contingentToContingenSql = (contingent: Contingent) => {
  let result: ContingentSql = {
    id: contingent.id,
    name: contingent.name,
    created_by: contingent.created_by,
    created_at: contingent.created_at,
  };
  return result;
};

export const contingentAtEventToContingentAtEventSql = (
  contingenAtEvent: ContingentAtEvent
) => {
  let result: ContingentAtEventSql = {
    registration_id: contingenAtEvent.registration_id,
    contingent_id: contingenAtEvent.contingent_id,
    championship_id: contingenAtEvent.championship_id,
    registered_at: contingenAtEvent.registered_at,
  };
  return result;
};

export const registeredContinentToContingentAtEvent = (
  registeredContigent: RegisteredContingent
) => {
  const result: ContingentAtEvent = {
    registration_id: registeredContigent.registration_id,
    contingent_id: registeredContigent.contingent_id,
    championship_id: registeredContigent.championship_id,
    registered_at: registeredContigent.registered_at,
    registered_athletes: registeredContigent.registered_athletes,
    registered_officials: registeredContigent.registered_officials,
    match_count: registeredContigent.match_count,
    payment_ids: registeredContigent.payment_ids,
    payment_total: registeredContigent.payment_total,
    payment_bill: registeredContigent.payment_bill,
  };
  return result;
};

export const getContingentConfirmationOption = (paid: boolean) => {
  let message = "";
  if (paid) {
    message = "Kontingen yang sudah melakukan pembayaran tidak dapat dihapus.";
  } else {
    message +=
      "Atlet dan Official yang tergabung dalam kontingen ini akan ikut terhapus. ";
    message += "Apakah anda yakin?";
  }
  const options = paid ? { cancelLabel: "Baik", cancelOnly: true } : undefined;

  return { ...options, message };
};
