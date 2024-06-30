"use client";
import { Button } from "@/components/ui/button";
import { useDownloadExcel } from "react-export-table-to-excel";

type Props = {
  fileName?: string;
  needShowAll?: boolean;
  isShowAll?: boolean;
  useId?: boolean;
};

const TableDownloadButton = ({
  fileName,
  needShowAll,
  isShowAll,
  useId,
}: Props) => {
  const ref = useId
    ? document.getElementById("download")
    : document.querySelector("table");

  const { onDownload } = useDownloadExcel({
    currentTableRef: ref,
    filename: fileName ?? "Table",
  });

  let isDisabled = !ref;

  if (needShowAll && !isShowAll) isDisabled = true;

  return (
    <Button disabled={isDisabled} onClick={onDownload}>
      Download
    </Button>
  );
};
export default TableDownloadButton;
