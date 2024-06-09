import { compare, reduceData } from "@/lib/functions";
import { Payment } from "@/lib/payment/paymentConstants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: Payment[];
  confirmed: Payment[];
  unconfirmed: Payment[];
};

const initialState: State = {
  all: [],
  confirmed: [],
  unconfirmed: [],
};

const getConfirmed = (state: any, payments: Payment[]) => {
  state.confirmed = payments.filter((payment) => payment.confirmed_by);
  state.unconfirmed = payments.filter((payment) => !payment.confirmed_by);
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    // ADD PAYMENTS
    addPaymentsRedux: (state, action: PayloadAction<Payment[]>) => {
      const newPayments = reduceData([
        ...state.all,
        ...action.payload,
      ]) as Payment[];
      state.all = newPayments.sort(compare("created_at", "desc"));
      getConfirmed(state, newPayments);
    },
  },
});

export const { addPaymentsRedux } = paymentsSlice.actions;
export default paymentsSlice.reducer;
