"use client";
import {
  AttendanceToken,
  InternalAthleteRole,
} from "@/lib/athlete/internal/internalAthleteConstants";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { toastError } from "@/lib/form/formFunctions";
import Loading from "@/components/ui/Loading";
import { Switch } from "@/components/ui/switch";
import { getSpecialUserLabel } from "@/lib/functions";
import {
  addAttendanceToken,
  getAttendanceToken,
  updateAttendanceToken,
} from "@/lib/athlete/internal/internalAthleteActions";

type Props = {
  athleteType: InternalAthleteRole;
};

const AttendanceBarcode = ({ athleteType }: Props) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<AttendanceToken | undefined>();

  const getToken = async () => {
    setLoading(true);
    try {
      const { result, error } = await getAttendanceToken(athleteType);
      if (error) throw error;

      setToken(result);
    } catch (error) {
      toastError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { result, error } = await addAttendanceToken(athleteType);
      if (error) throw error;

      setToken(result);
    } catch (error) {
      toastError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (state: boolean) => {
    setLoading(true);

    try {
      if (!token) {
        throw { message: "Token not found!" };
      }

      const { result, error } = await updateAttendanceToken({
        ...token,
        status: state,
      });
      if (error) throw error;

      setToken(result);
    } catch (error) {
      toastError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        value && !token && getToken();
      }}
    >
      <DialogTrigger asChild>
        <Button className="ml-auto">QR Code</Button>
      </DialogTrigger>
      <DialogContent className="w-fit flex flex-col items-center">
        <div className="w-fit flex flex-col items-center">
          <h2 className="mt-2 font-bold text-2xl">
            Absen {getSpecialUserLabel(athleteType)}
          </h2>
          {token ? (
            <div className="w-fit flex flex-col items-center gap-3">
              <QRCodeSVG value={token.token} size={250} />
              <div className="flex items-center gap-2">
                <Switch
                  className="scale-125 data-[state=unchecked]:bg-destructive"
                  checked={token.status}
                  onCheckedChange={(value) => toggleStatus(value)}
                  disabled={loading}
                />
                <p
                  className={`font-semibold text-xl ${
                    token.status ? "text-green-600" : "text-destructive"
                  }`}
                >
                  {token.status ? "Aktif" : "Nonaktif"}
                </p>
              </div>
            </div>
          ) : loading ? (
            <Loading text="Memuat QR Code" full className="scale-[.70]" />
          ) : (
            <Button onClick={handleGenerate}>Buat QR Code</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AttendanceBarcode;
