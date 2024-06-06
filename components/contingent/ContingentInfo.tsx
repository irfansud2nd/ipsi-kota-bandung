"use client";

import { RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import Link from "next/link";
import ContingentForm from "./ContingentForm";
import { getChampionship } from "@/lib/event/eventFunctions";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChampionshipMenuButton from "../championship/register/menu/ChampionshipMenuButton";
import { addRegisteredContingent } from "@/lib/contingent/contingentFunctions";
import { formatDate, formatToRupiah } from "@/lib/functions";
import { addContingentAtEventsRedux } from "@/lib/redux/championship/register/contingentSlice";

type Info = {
  key: string;
  value: string | number;
};

type RegisteredInfo = {
  championshipId: string;
  data: Info[];
};

const ContingentNotFound = ({ championshipId }: { championshipId: string }) => {
  const championship = getChampionship(championshipId);
  const disableRegister = championship?.status.editOnly;

  return (
    <div className="h-full w-full flex justify-center items-center text-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">
          Tidak ada kontingen terdaftar
        </h1>
        <p className="text-muted-foreground">
          {disableRegister
            ? "Maaf, pendaftaran telah ditutup"
            : "Daftarkan kontingen terlebih dahulu untuk melanjutkan"}
        </p>
        {disableRegister ? (
          <Button>
            <Link href={"/"}>Kembali ke halaman awal</Link>
          </Button>
        ) : (
          <ContingentForm championshipId={championshipId} />
        )}
      </div>
    </div>
  );
};

const TableComp = ({ data }: { data: Info[] }) => {
  return (
    <Table>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.key}>
            <TableCell className="font-medium">{item.key}</TableCell>
            <TableCell>{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ContingentInfo = ({ championshipId }: { championshipId: string }) => {
  const { unregistered, registered, contingentAtEvents } = useSelector(
    (state: RootState) => state.contingent
  );
  const dispatch = useDispatch();

  if (!unregistered)
    return <ContingentNotFound championshipId={championshipId} />;

  const defaultInfo = [
    {
      key: "Atlet",
      value: unregistered.athletes,
    },
    {
      key: "Official",
      value: unregistered.officials,
    },
    {
      key: "Waktu Pendaftaran",
      value: formatDate(unregistered.createdAt, { withoutHour: true }),
    },
  ];

  let registeredInfo: RegisteredInfo | undefined = undefined;

  if (registered) {
    registeredInfo = {
      championshipId: registered.championshipId,
      data: [
        {
          key: "Atlet",
          value: registered.registeredAthletes,
        },
        {
          key: "Official",
          value: registered.registeredOfficials,
        },
        {
          key: "Nomor Pertandingan",
          value: registered.matchCount,
        },
        {
          key: "Total Pembayaran",
          value: formatToRupiah(registered.paymentTotal),
        },
        {
          key: "Tagihan",
          value: formatToRupiah(registered.paymentBill),
        },
      ],
    };
  }

  let histories: RegisteredInfo[] = [];

  if (contingentAtEvents) {
    let data = contingentAtEvents.filter(
      (item) => item.championshipId != championshipId
    );
    data.map((item) =>
      histories.push({
        championshipId: item.championshipId,
        data: [
          {
            key: "Atlet",
            value: item.registeredAthletes,
          },
          {
            key: "Official",
            value: item.registeredOfficials,
          },
          {
            key: "Nomor Pertandingan",
            value: item.matchCount,
          },
        ],
      })
    );
  }

  console.log({ unregistered, registered, contingentAtEvents });

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <ChampionshipMenuButton />
        <h1 className="text-3xl font-semibold">Info Kontingen</h1>
      </div>
      <div className="flex justify-center items-center w-full flex-1 registration_content">
        <div className="w-full">
          <h1 className="font-semibold text-center text-2xl flex-1">
            Selamat Datang Kontingen
            <span className="font-semibold"> {unregistered.name} </span>!
          </h1>
          <div className="flex gap-2 justify-center mt-2">
            <Button>Edit Kontingen</Button>
            <Button variant={"destructive"}>Hapus Kontingen</Button>
          </div>
          <h2 className="font-medium text-xl">Info Kontingen</h2>
          <TableComp data={defaultInfo} />

          {!registered && (
            <div className="w-full flex flex-col bg-yellow-200 items-center rounded p-2 gap-2 my-2">
              <p className="font-medium text-center">
                Anda belum mendaftarkan kontingen {unregistered.name} pada
                kejuaraan
                {" " + getChampionship(championshipId)?.title}
              </p>
              <Button
                variant={"secondary"}
                onClick={() =>
                  addRegisteredContingent(unregistered, championshipId).then(
                    (contingentAtEvents) => {
                      dispatch(
                        addContingentAtEventsRedux({
                          contingentAtEvents,
                          championshipId,
                        })
                      );
                    }
                  )
                }
              >
                Daftarkan Kontingen
              </Button>
            </div>
          )}

          {registeredInfo && (
            <>
              <h2 className="font-medium text-xl text-center">
                Info {registered?.name} pada{" "}
                {getChampionship(championshipId)?.title}
              </h2>
              <TableComp data={registeredInfo.data} />
            </>
          )}

          {histories.length ? (
            <>
              <h2 className="font-medium text-xl">Event yang pernah diikuti</h2>
              <Accordion type="single" collapsible>
                {histories.map((history) => (
                  <AccordionItem
                    value={history.championshipId}
                    key={history.championshipId}
                  >
                    <AccordionTrigger>
                      {getChampionship(history.championshipId)?.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <TableComp data={history.data} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default ContingentInfo;
