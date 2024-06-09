"use client";

import { Anton } from "next/font/google";
import Link from "next/link";
import { BsFillHexagonFill } from "react-icons/bs";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import Terbilang from "terbilang-ts";
import { Button } from "../ui/button";
import { useReactToPrint } from "react-to-print";
import { ReactElement, useRef } from "react";
import { getChampionship, isLevelRookieOnly } from "@/lib/event/eventFunctions";
import { Championship } from "@/lib/event/eventConstants";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import {
  athleteGender,
  matchSchema,
} from "@/lib/athlete/external/athleteConstants";
import {
  getMatchCostByCategory,
  getTotalMatchCost,
} from "@/lib/athlete/external/athleteFunctions";
import { RegisteredContingent } from "@/lib/contingent/contingentConstants";
import { formatDate, formatToRupiah } from "@/lib/functions";

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
});

type Data = {
  id: string;
  count: number;
  cost: number;
};

const PaymentInvoice = ({
  championshipId,
  onPhone,
}: {
  championshipId: string;
  onPhone?: boolean;
}) => {
  const championship = getChampionship(championshipId) as Championship;
  const paidMatchBaseds = useSelector(
    (state: RootState) => state.athlete.matchBased
  );
  // .filter((item) => item.payment_id);

  const registeredContingent = useSelector(
    (state: RootState) => state.contingent.registered
  ) as RegisteredContingent;
  const limit = 8;

  const generateMatchBasedMatchId = () => {
    let ids: string[] = [];
    paidMatchBaseds.map((item) => {
      let id = "";
      if (item.category.includes("Tunggal")) {
        id += "Tunggal";
      } else if (item.category.includes("Ganda")) {
        id += "Ganda";
      } else if (item.category.includes("Regu")) {
        id += "Regu";
      } else {
        id += "Tanding";
      }
      id += ` ${item.gender}`;
      id += ` ${item.level.replace(/\s*\(.*?\)\s*/g, "")}`;
      if (!isLevelRookieOnly(item.level, championship)) id += ` ${item.schema}`;
      ids.push(id);
    });

    let groupedIds: { [key: string]: number } = ids.reduce(
      (acc: { [key: string]: number }, item: string) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      },
      {}
    );

    let result: { id: string; count: number }[] = Object.keys(groupedIds).map(
      (key) => ({
        id: key,
        count: groupedIds[key],
      })
    );

    return result;
  };

  const generateChampionshipMatchId = () => {
    let ids: string[] = [];
    championship.matchCategory.map((match) => {
      athleteGender.map((gender) => {
        let id = "Tanding";
        id += ` ${gender}`;
        id += ` ${match.level.replace(/\s*\(.*?\)\s*/g, "")}`;
        if (!match.rookieOnly) {
          matchSchema.map((item) => {
            let idScm = id;
            idScm += ` ${item}`;
            ids.push(idScm);
          });
        } else {
          // id += ` ${matchSchema[0]}`;
          ids.push(id);
        }
      });
      match.category.art.map((artCategory) => {
        athleteGender.map((gender) => {
          let id = "";
          id += artCategory;
          id += ` ${gender}`;
          id += ` ${match.level.replace(/\s*\(.*?\)\s*/g, "")}`;
          if (!match.rookieOnly) {
            matchSchema.map((item) => {
              let idScm = id;
              idScm += ` ${item}`;
              ids.push(idScm);
            });
          } else {
            // id += ` ${matchSchema[0]}`;
            ids.push(id);
          }
        });
      });
    });
    return ids;
  };

  const buildData = () => {
    const matchBasedIds = generateMatchBasedMatchId();
    const championshipMatchIds = generateChampionshipMatchId();

    let result: Data[] = [];

    championshipMatchIds.map((championshipMatchId) => {
      const isCountExist = matchBasedIds.find(
        (item) => item.id == championshipMatchId
      )?.count;
      if (isCountExist) {
        result.push({
          id: championshipMatchId,
          count: isCountExist || 0,
          cost: getMatchCostByCategory(
            championshipMatchId.split(" ")[0],
            championship
          ),
        });
      }
    });

    return result;
  };

  const splitData = () => {
    const builtData = buildData();
    let result: {
      contingentName: string;
      total: number;
      invoiceId: string;
      date: string;
      data: Data[];
    }[] = [];
    const today = formatDate(Date.now(), {
      withoutHour: true,
      shortYear: true,
      monthNumber: true,
    });
    const contingentName = registeredContingent.name;
    const total = getTotalMatchCost(paidMatchBaseds);
    const invoiceId = `BOPST-${today.replaceAll(" ", "")}-001`;
    const date = today.replaceAll(" ", "/");
    for (let i = 0; i < builtData.length; i += limit) {
      result.push({
        contingentName,
        total,
        invoiceId,
        date,
        data: builtData.slice(i, i + limit),
      });
    }
    return result;
  };

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice ${registeredContingent.name}`,
    onPrintError: () => alert("error"),
  });

  return (
    <>
      <Button onClick={handlePrint}>Download</Button>
      <div className="hidden">
        <div ref={printRef} className={`${onPhone && "scale-90"}`}>
          {splitData().map((data) => (
            <div className=" w-[1050px] h-[1485px] mx-auto font-semibold text-xl bg-gray-400">
              <div
                className="w-full h-full bg-contain bg-center bg-no-repeat px-16 pt-10 flex flex-col"
                style={{
                  backgroundImage:
                    "url(/images/championships/bandung-open-24/invoice-background.png)",
                }}
              >
                {/* LOGO */}
                <div className="flex gap-5 h-[130px]">
                  <img src="/images/logo-ipsi.png" className="aspect-square" />
                  <div className="h-full border-black border-x-2 rounded-full" />
                  <img
                    src="/images/championships/bandung-open-24/logo.png"
                    className="aspect-square"
                  />
                </div>
                {/* LOGO TEXT */}
                <div className={`w-[500px] mt-4 ${anton.className}`}>
                  <div className="flex gap-0 w-full items-center">
                    <h1 className={"text-7xl flex w-full justify-between"}>
                      {"BANDUNG".split("").map((item, i) => (
                        <span key={i} className="text-[#053858]">
                          {item}
                        </span>
                      ))}
                      <span> </span>
                      {"OPEN".split("").map((item, i) => (
                        <span key={i} className="text-[#BF994C]">
                          {item}
                        </span>
                      ))}
                    </h1>
                    <div className="ml-1 w-[24px] flex items-center justify-center">
                      <p className="text-2xl -rotate-90 tracking-[4px] text-[#053858]">
                        2024
                      </p>
                    </div>
                  </div>
                  <p className="flex justify-around text-3xl text-[#BF994C]">
                    {"PENCAK SILAT TOURNAMENT".split("").map((item, i) => (
                      <span key={i}>{item}</span>
                    ))}
                  </p>
                </div>
                {/* TITLE */}
                <div className="flex flex-col items-center my-5 gap-2">
                  <h1
                    className={`${anton.className} text-[#053858] mx-auto text-8xl w-fit`}
                  >
                    INVOICE
                  </h1>
                  <p className="font-bold text-xl">No : {data.invoiceId}</p>
                </div>
                {/* DESCRIPTION 1 */}
                <div className="flex justify-between font-bold text-xl">
                  <div>
                    <p>Kepada Yth:</p>
                    <p className="text-[#053858]">
                      Kontingen
                      <br />
                      {data.contingentName}
                    </p>
                    <p>
                      Jl. Jakarta, Kacapiring,
                      <br />
                      Kota Bandung
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <p>
                      Tipe
                      <br />
                      Tanggal
                    </p>
                    <p>
                      :
                      <br />:
                    </p>
                    <p>
                      Biaya Pendaftaran
                      <br />
                      {data.date}
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  {/* TABLE */}
                  <div className="flex items-center mt-5 text-2xl font-semibold">
                    <div className="relative -mr-3">
                      <BsFillHexagonFill className="size-20 text-[#7ED957]" />
                      <div className="absolute z-10 top-0 bottom-0 left-0 right-0 flex justify-center items-center">
                        <p className="text-white ">No</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 place-items-center bg-yellow-200 pl-20 px-3 py-1 justify-between w-full items-center h-fit">
                      <p className="col-span-2">ITEMS</p>
                      <p>QTY</p>
                      <p>PRICE</p>
                      <p>TOTAL</p>
                    </div>
                  </div>
                  {data.data.map((item, i) => (
                    <div className="flex items-center text-lg font-medium border-b border-black">
                      <p className="w-20 text-center">{i + 1}</p>

                      <div className="grid grid-cols-5 place-items-center pl-20 px-3 justify-between w-full items-center h-fit ">
                        <p className="col-span-2">{item.id}</p>
                        <p>{item.count}</p>
                        <p>{formatToRupiah(item.cost)}</p>
                        <p>{formatToRupiah(item.count * item.cost)}</p>
                      </div>
                    </div>
                  ))}
                  {/* TOTAL 1 */}
                  <p className="text-end mt-2 mr-12">
                    Total
                    <span className="ml-20">{formatToRupiah(data.total)}</span>
                  </p>
                  {/* TOTAL 2 */}
                  <div className="flex justify-between my-3">
                    <div>
                      <p>Terbilang:</p>
                      <p className="italic text-gray-800">
                        {Terbilang(data.total)}
                      </p>
                    </div>
                    <div
                      className={`bg-[#053858] flex gap-2 items-center text-2xl px-5 tracking-wider font-bold text-white`}
                    >
                      <p>GRAND TOTAL</p>
                      <p>{formatToRupiah(data.total)}</p>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION 2 */}
                <div className="grid grid-cols-[auto_1fr] mt-2 text-justify text-lg mb-14">
                  <div className="w-[450px]">
                    <p>
                      Pembayaran invoice diatas dibayarkan pada :
                      <br />
                      Bagian Keuangan “Bandung Open Pencak Silat Tournament
                      2024”
                      <br />
                      0129228164100
                      <br />
                      Bank BJB a.n ANDRA RAMDHAN MALELA POETRA
                    </p>
                    <p className="mt-3">
                      Setelah melakukan pembayaran harap melakukan konfirmasi di
                      web pendaftaran dengan mengupload/melampirkan bukti
                      transfer
                    </p>
                  </div>
                  <div className="flex justify-center items-end gap-x-[200px] w-full">
                    <span>(</span>
                    <span>)</span>
                  </div>
                </div>
                <div className="ml-auto w-[800px] h-[60px] flex justify-around items-center">
                  <Link href={""} className="flex gap-2 items-center">
                    <FaWhatsapp className="size-9" />
                    089668654500 (Bob)
                  </Link>
                  <Link href={""} className="flex gap-2 items-center">
                    <FaInstagram className="size-9" />
                    ipsikotabandung
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default PaymentInvoice;
