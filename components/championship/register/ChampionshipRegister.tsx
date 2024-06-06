"use client";
import Contingent from "@/components/contingent/ContingentInfo";
import Loading from "@/components/ui/Loading";
import { getAthletes } from "@/lib/athlete/external/athleteFunctions";
import { getContingent } from "@/lib/contingent/contingentFunctions";
import { getChampionship } from "@/lib/event/eventFunctions";
import {
  addAthletesAtEventsRedux,
  addAthletesRedux,
} from "@/lib/redux/championship/register/athleteSlice";
import {
  addContingentAtEventsRedux,
  setUnregisteredContingent,
} from "@/lib/redux/championship/register/contingentSlice";
import { RootState } from "@/lib/redux/store";
import { register } from "module";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  children: React.ReactNode;
  championshipId: string;
};
const ChampionshipRegister = ({ children, championshipId }: Props) => {
  const [fetched, setFetched] = useState({
    contingent: false,
    athletes: false,
    officials: true,
    payments: true,
  });

  const {
    registered: registeredContingent,
    unregistered: unregisteredContingent,
  } = useSelector((state: RootState) => state.contingent);

  const dispatch = useDispatch();
  const pathname = usePathname();

  const fetchContingent = async () => {
    console.log("getContingent");
    const { contingent, contingentAtEvents } = await getContingent();
    setFetched((prev) => ({ ...prev, contingent: true }));

    // UNREGISTERED CONTINGENT
    if (!contingent) return;
    dispatch(setUnregisteredContingent(contingent));

    // CONTINGENT COMPLETE INFO
    if (!contingentAtEvents.length) return;
    dispatch(
      addContingentAtEventsRedux({
        contingentAtEvents,
        championshipId,
      })
    );
  };

  const fetchAthletes = async () => {
    console.log("getAthletes");
    const { athletes, athleteAtEvents } = await getAthletes(championshipId);
    setFetched((prev) => ({ ...prev, athletes: true }));

    dispatch(addAthletesRedux(athletes));
    dispatch(addAthletesAtEventsRedux(athleteAtEvents));
  };

  useEffect(() => {
    if (["schedule", "medal"].some((item) => pathname.includes(item))) {
      setFetched((prev) => {
        let result: any = prev;
        Object.keys(result).forEach((key) => (result[key] = true));
        return result;
      });
    } else if (!unregisteredContingent) {
      fetchContingent();
    }
  });

  useEffect(() => {
    if (registeredContingent && !fetched.athletes) {
      fetchAthletes();
    }
  }, [registeredContingent]);

  if (!Object.values(fetched).every((item) => item == true))
    return <Loading full />;

  if (!registeredContingent) {
    if (
      ["athlete", "official", "fight", "art", "payment"].some((item) =>
        pathname.includes(item)
      )
    )
      return <Contingent championshipId={championshipId} />;
  }

  return <>{children}</>;
};
export default ChampionshipRegister;
