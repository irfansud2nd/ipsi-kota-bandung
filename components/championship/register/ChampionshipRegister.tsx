"use client";

import Contingent from "@/components/contingent/ContingentInfo";
import Loading from "@/components/ui/Loading";
import { getAthtleteAtEventsByContingentRegistrationId } from "@/lib/athlete/external/athleteActions";
import { getAthletesByEmail } from "@/lib/athlete/external/athleteFunctions";
import { getContingentInfoByEmail } from "@/lib/contingent/contingentFunctions";
import { getChampionship } from "@/lib/event/eventFunctions";
import { toastError } from "@/lib/form/formFunctions";
import { getOfficialsByEmail } from "@/lib/official/officialFunctions";
import { getPaymentsByContingentRegistrationId } from "@/lib/payment/paymentActions";
import {
  addAthletesAtEventsRedux,
  addAthletesRedux,
} from "@/lib/redux/championship/register/athleteSlice";
import {
  addContingentAtEventsRedux,
  setUnregisteredContingent,
} from "@/lib/redux/championship/register/contingentSlice";
import { addOfficialsRedux } from "@/lib/redux/championship/register/officialSlice";
import { addPaymentsRedux } from "@/lib/redux/championship/register/paymentSlice";
import { RootState } from "@/lib/redux/store";
import { useSession } from "next-auth/react";
import { notFound, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  children: React.ReactNode;
  championshipId: string;
};
const ChampionshipRegister = ({ children, championshipId }: Props) => {
  const [fetched, setFetched] = useState({
    contingent: false,
    athlete: false,
    official: false,
    payment: false,
  });
  // const [contingentFetched, setContingentFetched] = useState(false);
  const [readyToFetch, setReadyToFetch] = useState(false);
  const [returnWithoutFetch, setReturnWithoutFetch] = useState(false);

  const registeredContingent = useSelector(
    (state: RootState) => state.contingent.registered
  );

  const athletes = useSelector((state: RootState) => state.athlete.all);
  const officials = useSelector((state: RootState) => state.official.all);
  const payments = useSelector((state: RootState) => state.payment.all);

  const dispatch = useDispatch();
  const pathname = usePathname();
  const session = useSession();
  const router = useRouter();

  const championship = getChampionship(championshipId);

  const userEmail = session.data?.user?.email as string;

  const fetchContingent = async () => {
    // console.log("fetchContingent");

    try {
      const { contingent, contingentAtEvents } = await getContingentInfoByEmail(
        userEmail
      );

      if (!contingent) {
        setAllFetched();
        return;
      }
      dispatch(setUnregisteredContingent(contingent));

      if (!contingentAtEvents.length) {
        setAllFetched();
        return;
      }
      dispatch(
        addContingentAtEventsRedux({
          contingentAtEvents,
          championshipId,
        })
      );

      setFetched((prev) => ({ ...prev, contingent: true }));
    } catch (error) {
      toastError(error);
    }
  };

  const fetchAthletes = async () => {
    // console.log("fetchAthletes");
    try {
      const athletes = await getAthletesByEmail(userEmail);
      dispatch(addAthletesRedux(athletes));

      const athleteAtEvents =
        await getAthtleteAtEventsByContingentRegistrationId(
          registeredContingent?.registration_id as number
        );
      dispatch(addAthletesAtEventsRedux(athleteAtEvents));

      setFetched((prev) => ({ ...prev, athlete: true }));
    } catch (error) {
      toastError(error);
    }
  };

  const fetchOfficials = async () => {
    // console.log("fetchOfficials");
    try {
      const officials = await getOfficialsByEmail(userEmail);
      dispatch(addOfficialsRedux(officials));

      setFetched((prev) => ({ ...prev, official: true }));
    } catch (error) {
      toastError(error);
    }
  };

  const fetchPayments = async () => {
    // console.log("fetchPayments");
    if (!registeredContingent) return;
    try {
      const payments = await getPaymentsByContingentRegistrationId(
        registeredContingent.registration_id
      );
      dispatch(addPaymentsRedux(payments));

      setFetched((prev) => ({ ...prev, payment: true }));
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    const pathnameArr = pathname.split("/");
    const lastPathname = pathnameArr[pathnameArr.length - 1];
    if (lastPathname == "register") {
      router.push("register/contingent");
      return;
    }
    if (championship) {
      setReadyToFetch(true);
    }
  }, [pathname, championship]);

  useEffect(() => {
    if (readyToFetch && !fetched.contingent && !returnWithoutFetch)
      fetchContingent();
  }, [readyToFetch, returnWithoutFetch]);

  useEffect(() => {
    if (registeredContingent) {
      // console.log("REGISTERED CONTINGENT", registeredContingent);
      if (registeredContingent.athletes > 0 && !athletes.length) {
        fetchAthletes();
      } else {
        setFetched((prev) => ({ ...prev, athlete: true }));
      }
      if (registeredContingent.officials > 0 && !officials.length) {
        fetchOfficials();
      } else {
        setFetched((prev) => ({ ...prev, official: true }));
      }
      if (registeredContingent.payment_ids?.length > 0 && !payments.length) {
        fetchPayments();
      } else {
        setFetched((prev) => ({ ...prev, payment: true }));
      }
    }
  }, [registeredContingent]);

  useEffect(() => {
    setReturnWithoutFetch(
      ["schedule", "medal"].some((item) => pathname.includes(item))
    );
  }, [pathname]);

  const isAllFetched = () => {
    return Object.values(fetched).every((value) => value == true);
  };

  const setAllFetched = () => {
    setFetched({
      contingent: true,
      athlete: true,
      official: true,
      payment: true,
    });
  };

  // useEffect(() => {
  //   console.log("FETCHED", fetched);
  // }, [fetched]);

  if (!isAllFetched() && !returnWithoutFetch) return <Loading full />;

  if (!registeredContingent && !returnWithoutFetch) {
    return (
      <div className="p-1 py-2 w-full max-w-full grid grid-cols-1">
        <Contingent championshipId={championshipId} />
      </div>
    );
  }

  return <>{children}</>;
};
export default ChampionshipRegister;
