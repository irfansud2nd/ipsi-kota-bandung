import { compare, reduceData } from "@/lib/functions";
import { Official } from "@/lib/official/officialContants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: Official[];
  officialToEdit: Official | undefined;
};

const initialState: State = {
  all: [],
  officialToEdit: undefined,
};

const officialsSlice = createSlice({
  name: "officials",
  initialState,
  reducers: {
    addOfficialsRedux: (state, action: PayloadAction<Official[]>) => {
      let data = reduceData([...state.all, ...action.payload]) as Official[];
      state.all = data.sort(compare("name", "asc"));
    },
    deleteOfficialRedux: (state, action: PayloadAction<Official>) => {
      state.all = state.all.filter((item) => item.id !== action.payload.id);
    },
    deleteAllOficialsRedux: (state) => {
      state.all = [];
    },
    setOfficialToEditRedux: (
      state,
      action: PayloadAction<Official | undefined>
    ) => {
      state.officialToEdit = action.payload;
    },
    changeOfficialContingentNameRedux: (
      state,
      action: PayloadAction<string>
    ) => {
      const contingentName = action.payload;
      state.all = state.all.map((item) => ({
        ...item,
        contingent_name: contingentName,
      }));
    },
  },
});

export const {
  addOfficialsRedux,
  deleteOfficialRedux,
  deleteAllOficialsRedux,
  setOfficialToEditRedux,
  changeOfficialContingentNameRedux,
} = officialsSlice.actions;
export default officialsSlice.reducer;
