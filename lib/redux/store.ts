import { configureStore } from "@reduxjs/toolkit";
import sideMenuReducer from "@/lib/redux/championship/championshipMenuSlice";
import contingentReducer from "@/lib/redux/championship/register/contingentSlice";
import athleteReducer from "@/lib/redux/championship/register/athleteSlice";
import officialReducer from "@/lib/redux/championship/register/officialSlice";
import paymentReducer from "@/lib/redux/championship/register/paymentSlice";

export const store = configureStore({
  reducer: {
    sideMenu: sideMenuReducer,
    contingent: contingentReducer,
    athlete: athleteReducer,
    official: officialReducer,
    payment: paymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
