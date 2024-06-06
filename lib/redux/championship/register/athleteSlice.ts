import {
  AthleteAtEvent,
  Athlete,
  RegisteredAthlete,
  athleteInitialValue,
  MatchBased,
} from "@/lib/athlete/external/athleteConstants";
import { compare, reduceData } from "@/lib/functions";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  all: Athlete[];
  athleteAtEvents: AthleteAtEvent[];
  registered: RegisteredAthlete[];
  matchBased: MatchBased[];
  athleteToEdit: Athlete | undefined;
  athletAtEventToEdit: AthleteAtEvent | undefined;
};

const initialState: State = {
  all: [],
  athleteAtEvents: [],
  registered: [],
  matchBased: [],
  athleteToEdit: undefined,
  athletAtEventToEdit: undefined,
};

const getRegistered = (state: State, data: Athlete[]) => {
  //   let result: Athlete[] = [];
  //   data.map((athlete) => {
  //     if (athlete.match.length) {
  //       athlete.match.map((match) => {
  //         const data: Athlete = { ...athlete, match: [match] };
  //         result.push(data);
  //       });
  //     }
  //   });
  //   state.registered = result.sort(compare("name", "asc"));
};

const getFiltered = (state: State, athletes: Athlete[]) => {
  //   athletes.map((athlete) => {
  //     athlete.match.map((match) => {
  //       const idMatch = `${match.jenis}/${match.tingkatan}/${match.kategori}/${athlete.jenisKelamin}`;
  //       const exist = state.filtered.find(
  //         (item) => item.idMatch == idMatch
  //       );
  //       if (exist) {
  //         const newAthletes = reduceData([
  //           ...exist.athletes,
  //           athlete,
  //         ]) as Athlete[];
  //         state.filtered = reduceData([
  //           ...state.filtered,
  //           { idMatch, athletes: newAthletes },
  //         ]) as FilteredAthletes[];
  //       } else {
  //         state.filtered = [
  //           ...state.filtered,
  //           { idMatch, athletes: [athlete] },
  //         ];
  //       }
  //     });
  //   });
};

const athleteSlice = createSlice({
  name: "athletes",
  initialState,
  reducers: {
    addAthletesRedux: (state, action: PayloadAction<Athlete[]>) => {
      let data = reduceData([...state.all, ...action.payload]) as Athlete[];
      state.all = data.sort(compare("name", "asc"));
    },
    setAthleteToEditRedux: (
      state,
      action: PayloadAction<Athlete | undefined>
    ) => {
      state.athleteToEdit = action.payload;
    },
    addAthletesAtEventsRedux: (
      state,
      action: PayloadAction<AthleteAtEvent[]>
    ) => {
      let athleteAtEvents = reduceData(
        [...state.athleteAtEvents, ...action.payload],
        "registrationId"
      ) as AthleteAtEvent[];

      state.athleteAtEvents = athleteAtEvents;

      let registeredAthletes: RegisteredAthlete[] = [];
      state.all.map((athlete) => {
        registeredAthletes.push({
          ...athlete,
          matches: athleteAtEvents.filter(
            (match) => match.athleteId == athlete.id
          ),
        });
      });
      state.registered = registeredAthletes;

      let matchBaseds: MatchBased[] = [];
      registeredAthletes.map((athlete) =>
        athlete.matches.map((match) =>
          matchBaseds.push({ ...athlete, ...match })
        )
      );

      matchBaseds = reduceData(
        [...state.matchBased, ...matchBaseds],
        "registrationId"
      ) as MatchBased[];
      state.matchBased = matchBaseds;
    },
    deleteAthleteAtEventRedux: (
      state,
      action: PayloadAction<AthleteAtEvent>
    ) => {
      state.athleteAtEvents = state.athleteAtEvents.filter(
        (item) => item.registrationId != action.payload.registrationId
      );
      state.matchBased = state.matchBased.filter(
        (item) => item.registrationId != action.payload.registrationId
      );
    },

    setAthleteAtEventToEditRedux: (
      state,
      action: PayloadAction<AthleteAtEvent | undefined>
    ) => {
      state.athletAtEventToEdit = action.payload;
    },
  },
});

export const {
  addAthletesRedux,
  setAthleteToEditRedux,
  addAthletesAtEventsRedux,
  deleteAthleteAtEventRedux,
  setAthleteAtEventToEditRedux,
} = athleteSlice.actions;
export default athleteSlice.reducer;
