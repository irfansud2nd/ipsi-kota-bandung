import { configureStore } from "@reduxjs/toolkit";
import sideMenuReducer from "@/lib/redux/championship/championshipMenuSlice";
import athleteReducer from "@/lib/redux/championship/register/athleteSlice";
import contingentReducer from "@/lib/redux/championship/register/contingentSlice";

export const store = configureStore({
  reducer: {
    sideMenu: sideMenuReducer,
    athlete: athleteReducer,
    contingent: contingentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
