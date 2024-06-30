import * as yup from "yup";

export type ContingentSql = {
  id: string;
  name: string;
  created_by: string;
  created_at: number;
};

export type Contingent = ContingentSql & {
  athletes: number;
  officials: number;
};

export type ContingentAtEventSql = {
  registration_id: number;
  contingent_id: string;
  championship_id: string;
  registered_at: number;
};

export type ContingentAtEvent = ContingentAtEventSql & {
  registered_athletes: number;
  registered_officials: number;
  match_count: number;
  payment_ids: string[];
  payment_total: number;
  payment_bill: number;
};

export type RegisteredContingent = Contingent & ContingentAtEvent;

export type RegisteredContingentAdmin = RegisteredContingent & {
  rookie_fight: number;
  rookie_art: number;
  professional_fight: number;
  professional_art: number;
};

export const contingentInitialValue: Contingent = {
  id: "",
  name: "",
  athletes: 0,
  officials: 0,
  created_at: 0,
  created_by: "",
};

export const contingentSchema = yup.object({
  name: yup.string().required("Tolong lengkapi nama kontingen"),
});
