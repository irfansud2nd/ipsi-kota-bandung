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
  athleteAtEventToEdit: AthleteAtEvent | undefined;
};

const initialState: State = {
  all: [],
  athleteAtEvents: [],
  registered: [],
  matchBased: [],
  athleteToEdit: undefined,
  athleteAtEventToEdit: undefined,
};

const athleteSlice = createSlice({
  name: "athletes",
  initialState,
  reducers: {
    addAthletesRedux: (state, action: PayloadAction<Athlete[]>) => {
      let data = reduceData([...state.all, ...action.payload]) as Athlete[];
      state.all = data.sort(compare("name", "asc"));
    },
    deleteAthleteRedux: (state, action: PayloadAction<Athlete>) => {
      const athlete = action.payload;

      state.all = state.all.filter((item) => item.id !== athlete.id);
      state.registered = state.registered.filter(
        (item) => item.id !== athlete.id
      );
      state.athleteAtEvents = state.athleteAtEvents.filter(
        (item) => item.athlete_id !== athlete.id
      );
      state.matchBased = state.matchBased.filter(
        (item) => item.athlete_id !== athlete.id
      );
    },
    deleteAllAthletesRedux: (state) => {
      state.all = [];
      state.athleteAtEvents = [];
      state.matchBased = [];
      state.registered = [];
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
      if (!action.payload.length) return;

      let athleteAtEvents = reduceData(
        [...state.athleteAtEvents, ...action.payload],
        "registration_id"
      ) as AthleteAtEvent[];

      state.athleteAtEvents = athleteAtEvents;

      let registeredAthletes: RegisteredAthlete[] = [];
      state.all.map((athlete) => {
        registeredAthletes.push({
          ...athlete,
          matches: athleteAtEvents.filter(
            (match) => match.athlete_id == athlete.id
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
        "registration_id"
      ) as MatchBased[];
      state.matchBased = matchBaseds;
    },
    deleteAthleteAtEventRedux: (
      state,
      action: PayloadAction<AthleteAtEvent>
    ) => {
      state.athleteAtEvents = state.athleteAtEvents.filter(
        (item) => item.registration_id != action.payload.registration_id
      );
      state.matchBased = state.matchBased.filter(
        (item) => item.registration_id != action.payload.registration_id
      );
    },
    setAthleteAtEventToEditRedux: (
      state,
      action: PayloadAction<AthleteAtEvent | undefined>
    ) => {
      state.athleteAtEventToEdit = action.payload;
    },
  },
});

export const {
  addAthletesRedux,
  deleteAthleteRedux,
  deleteAllAthletesRedux,
  setAthleteToEditRedux,
  addAthletesAtEventsRedux,
  deleteAthleteAtEventRedux,
  setAthleteAtEventToEditRedux,
} = athleteSlice.actions;
export default athleteSlice.reducer;
