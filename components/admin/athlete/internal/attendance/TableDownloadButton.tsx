"use client";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

const TableDownloadButton = ({ fileName }: { fileName?: string }) => {
  const ref = document.getElementById("table");

  const { onDownload } = useDownloadExcel({
    currentTableRef: ref,
    filename: fileName ?? "Table",
  });

  return (
    <Button disabled={!ref} onClick={onDownload}>
      Download
    </Button>
  );
};
export default TableDownloadButton;
