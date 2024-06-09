"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { BsQrCodeScan } from "react-icons/bs";
import { FaCameraRotate, FaStop } from "react-icons/fa6";
import { InternalAthleteRole } from "@/lib/athlete/internal/internalAthleteConstants";
import { current } from "@reduxjs/toolkit";
import Loading from "@/components/ui/Loading";
import { useSession } from "next-auth/react";
import { sendAttendance } from "@/lib/athlete/internal/internalAthleteFunctions";
import { toastError } from "@/lib/form/formFunctions";
import { toast } from "sonner";

type Props = {
  athleteType: InternalAthleteRole;
};

let stopScan = false;

const AttendanceScanner = ({ athleteType }: Props) => {
  const [btnScan, setBtnScan] = useState(true);
  const [result, setResult] = useState("");
  const [frontCamera, setFrontCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = useSession();

  const scanNow = async (isScan: boolean) => {
    setBtnScan(isScan);
    if (isScan) stopScan = true;
    if (btnScan === false) return;
    stopScan = false;
    await new Promise((r) => setTimeout(r, 100));
    const videoElement = document.getElementById(
      "scanView"
    ) as HTMLVideoElement;
    if (videoElement == null) return;
    const scanner = new QrScanner(
      videoElement,
      (result) => {
        handleSubmit(result.data);
        setResult(result.data);
        setBtnScan(true);
        stopScan = true;
      },
      {
        maxScansPerSecond: 1,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
        preferredCamera: frontCamera ? "user" : "environment",
      }
    );
    await scanner.start();
    while (stopScan === false) await new Promise((r) => setTimeout(r, 100));
    scanner.stop();
    scanner.destroy();
  };

  useEffect(() => {
    return () => {
      if (!btnScan) scanNow(true);
    };
  }, []);

  const handleSubmit = (result: string) => {
    if (!result || !session.data?.user?.email) return;
    setIsSubmitting(true);
    sendAttendance(result, session.data.user.email, athleteType, "present")
      .catch((error) => {
        if (error.response.data.code == "23505") return;
        toastError(error);
        setResult("");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="size-[400px] max-w-[90vw] max-h-[90vh] rounded-md overflow-hidden bg-muted relative">
        {result ? (
          <Loading
            full
            success={!isSubmitting}
            text={
              isSubmitting
                ? "Menyimpan kehadiran"
                : "Kehadiran berhasil disimpan"
            }
          />
        ) : (
          <>
            <Button
              className="w-fit size-10 *:size-6 rounded-full absolute bottom-2 left-2 z-[3]"
              size={"icon"}
              onClick={() => {
                setFrontCamera((prev) => !prev);
              }}
            >
              <FaCameraRotate />
            </Button>
            <Button
              className="w-fit size-10 *:size-6 rounded-full absolute bottom-2 right-2 z-[3]"
              size={"icon"}
              onClick={() => {
                scanNow(!btnScan);
              }}
            >
              {btnScan ? <BsQrCodeScan /> : <FaStop />}
            </Button>
            <video
              id="scanView"
              className="w-full h-full object-center object-cover"
            />
          </>
        )}
      </div>
    </div>
  );
};
export default AttendanceScanner;
