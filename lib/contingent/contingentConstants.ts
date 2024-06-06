import * as yup from "yup";

export type Contingent = {
  id: string;
  name: string;
  athletes: number;
  officials: number;
  createdBy: string;
  createdAt: number;
};

export type ContingentAtEvent = {
  registrationId: number;
  contingentId: string;
  championshipId: string;
  registeredAthletes: number;
  registeredOfficials: number;
  matchCount: number;
  paymentIds: string[];
  paymentTotal: number;
  paymentBill: number;
  registeredAt: number;
};

export type RegisteredContingent = Contingent & ContingentAtEvent;

export const contingentInitialValue: Contingent = {
  id: "",
  name: "",
  athletes: 0,
  officials: 0,
  createdAt: 0,
  createdBy: "",
};

export const contingentSchema = yup.object({
  name: yup.string().required("Tolong lengkapi nama kontingen"),
});
