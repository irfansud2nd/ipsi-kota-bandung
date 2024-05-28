"use client";
import { ErrorMessage, FormikProps } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import ErrorText from "../ui/ErrorText";
import { calculateAge } from "@/lib/athlete/athleteFunctions";
import { Input } from "../ui/input";
import { championships } from "@/lib/event/eventConstants";
import { InputProps } from "@/lib/form/formConstants";
import { Button } from "../ui/button";
import useShowFileDialog from "@/hooks/useShowFile";

type Props = InputProps & {
  landscape?: boolean;
  isFileChanging?: (value: boolean) => void;
};

const InputFile = ({
  label,
  name,
  formik,
  under17,
  className,
  showOnEditOnly,
  eventId,
  landscape,
  isFileChanging,
}: Props) => {
  const [url, setUrl] = useState("");
  const [disableShow, setDisableShow] = useState(false);
  const [changingFile, setChangingFile] = useState(false);

  const { setFieldValue, values, isSubmitting, setFieldTouched } = formik;
  const { file, downloadUrl } = values[name];

  useEffect(() => {
    if (downloadUrl) {
      if (changingFile) {
        file && setUrl(URL.createObjectURL(file));
        !file && setFieldValue(name, { file: undefined, downloadUrl });
        setDisableShow(file ? false : true);
      } else {
        setUrl(downloadUrl);
        setDisableShow(false);
      }
      !changingFile && setFieldValue(`${name}.file`, undefined);
    } else {
      setDisableShow(!file);
      file && setUrl(URL.createObjectURL(file));
    }
    isFileChanging && isFileChanging(changingFile);
  }, [file, downloadUrl, changingFile]);

  let umur;
  if (under17) {
    umur = calculateAge(values.tanggalLahir);
  }
  const editOnly = championships.find((event) => event.id == eventId)?.status
    .editOnly;

  const { showFile, ShowFileDialog } = useShowFileDialog();

  return (
    <div
      className={`input_container
      ${className} 
      ${editOnly && !showOnEditOnly && "hidden"}`}
    >
      <Label>
        {label}
        {under17 ? (
          <Badge className="px-1 py-0  pb-0.5 ml-1">
            {umur && umur >= 17 ? "Atlet" : "Orang Tua"}
          </Badge>
        ) : null}
        <span className="text-muted-foreground text-xs ml-1">(Max 1 MB)</span>
      </Label>
      <div
        className={`${
          downloadUrl ? "grid  grid-cols-[1fr_auto_auto]" : "flex"
        } gap-1`}
      >
        {(changingFile || !downloadUrl) && (
          <Input
            onBlur={() => setFieldTouched(`${name}.file`, true)}
            onChange={(e) => {
              e.target.files?.length &&
                setFieldValue(`${name}.file`, e.target.files[0]);
            }}
            accept=".jpg, .jpeg, .png"
            type="file"
            disabled={isSubmitting}
          />
        )}
        {!changingFile && downloadUrl && (
          <p className="w-full max-w-full whitespace-nowrap overflow-hidden border p-1.5 rounded">
            {downloadUrl}
          </p>
        )}
        <Button
          type="button"
          disabled={disableShow}
          onClick={() => showFile("Gambar", url, landscape)}
        >
          Show
        </Button>
        {downloadUrl && (
          <Button
            type="button"
            onClick={() => setChangingFile((prev) => !prev)}
          >
            {changingFile ? "Batal" : "Ubah"}
          </Button>
        )}
      </div>
      <ErrorMessage name={`${name}.file`} component={ErrorText} />
      <ShowFileDialog />
    </div>
  );
};

export default InputFile;
