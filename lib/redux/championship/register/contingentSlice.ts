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

      const currentContigentAtEvent = data.find((item) => {
        return item.championship_id == action.payload.championshipId;
      });

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
    deleteContingentAtEventRedux: (
      state,
      action: PayloadAction<ContingentAtEvent>
    ) => {
      state.contingentAtEvents = state.contingentAtEvents.filter(
        (item) => item.championship_id !== action.payload.championship_id
      );
      state.registered = undefined;
    },
    deleteContingentRedux: (state) => {
      state.all = [];
      state.unregistered = undefined;
      state.registered = undefined;
      state.contingentAtEvents = [];
    },
  },
});

export const {
  setUnregisteredContingent,
  addContingentAtEventsRedux,
  deleteContingentAtEventRedux,
  updateContingentRedux,
  deleteContingentRedux,
} = contingentSlice.actions;
export default contingentSlice.reducer;
