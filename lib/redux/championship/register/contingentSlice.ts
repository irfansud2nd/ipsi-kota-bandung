import {
  Contingent,
  ContingentAtEvent,
  RegisteredContingent,
} from "@/lib/contingent/contingentConstants";
import { reduceData } from "@/lib/functions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: Contingent[];
  unregistered: Contingent | undefined;
  registered: RegisteredContingent | undefined;
  contingentAtEvents: ContingentAtEvent[];
  toEdit: Contingent | undefined;
};

const initialState: State = {
  all: [],
  unregistered: undefined,
  registered: undefined,
  contingentAtEvents: [],
  toEdit: undefined,
};

const contingentSlice = createSlice({
  name: "contingent",
  initialState,
  reducers: {
    setUnregisteredContingent: (state, action: PayloadAction<Contingent>) => {
      state.unregistered = action.payload;
    },
    addContingentAtEventsRedux: (
      state,
      action: PayloadAction<{
        contingentAtEvents: ContingentAtEvent[];
        championshipId: string;
      }>
    ) => {
      let data = reduceData([
        ...state.contingentAtEvents,
        ...action.payload.contingentAtEvents,
      ]) as ContingentAtEvent[];
      state.contingentAtEvents = data;

      console.log("FROM SLICE", { data });
      console.log("FROM SLICE", action.payload);

      const currentContigentAtEvent = data.find((item) => {
        console.log({
          item: item,
          payload: action.payload.championshipId,
        });
        return item.championshipId == action.payload.championshipId;
      });

      console.log("FROM SLICE", { data, currentContigentAtEvent });
      console.log("FROM SLICE", state.unregistered);

      if (currentContigentAtEvent && state.unregistered)
        state.registered = {
          ...state.unregistered,
          ...currentContigentAtEvent,
        };
    },
    updateContingentRedux: (state, action: PayloadAction<Contingent>) => {
      state.unregistered = action.payload;
      if (state.registered) {
        state.registered = {
          ...state.registered,
          ...action.payload,
        };
      }
    },
  },
});

export const {
  setUnregisteredContingent,
  addContingentAtEventsRedux,
  updateContingentRedux,
} = contingentSlice.actions;
export default contingentSlice.reducer;
