"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateAthleteDownloadedIDCard } from "@/lib/athlete/external/athleteActions";
import { updateOfficialDownloadedIDCard } from "@/lib/official/officialActions";
import { useRouter } from "next/navigation";

export default function IdCards({
  champId,
  data,
  isAthlete,
  downloadAll,
}: {
  champId: string;
  data: {
    id: string;
    name: string;
    contingent_name: string;
    image?: string;
  }[];
  isAthlete: boolean;
  downloadAll: boolean;
}) {
  const router = useRouter();
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  async function waitForImages(container: HTMLElement) {
    const images = Array.from(container.querySelectorAll("img"));
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(true);
            else img.onload = () => resolve(true);
          })
      )
    );
  }

  const BATCH_SIZE = 5;

  const handleBulkDownload = async () => {
    const toastId = toast.loading("Memproses ID Card");
    const zip = new JSZip();

    await document.fonts.ready;

    for (let i = 0; i < refs.current.length; i += BATCH_SIZE) {
      const batch = refs.current.slice(i, i + BATCH_SIZE);

      toast.loading(`Memproses ID Card ${i}/${data.length}`, {
        id: toastId,
      });

      const results = await Promise.all(
        batch.map(async (node, idx) => {
          if (!node) return null;
          await waitForImages(node);

          const dataUrl = await toPng(node, {
            pixelRatio: 2,
            cacheBust: true,
          });

          const selectedData = data[i + idx];
          return {
            name: `${selectedData.name.toUpperCase()}_${selectedData.contingent_name.toUpperCase()}.png`,
            data: dataUrl.split(",")[1],
          };
        })
      );

      results.forEach((res) => {
        if (res) {
          zip.file(res.name, res.data, { base64: true });
        }
      });

      // kasih jeda biar ga freeze
      await new Promise((r) => setTimeout(r, 50));
    }

    const blob = await zip.generateAsync({ type: "blob" });
    toast.loading("Marking rows", { id: toastId });
    const updateFunc = isAthlete
      ? updateAthleteDownloadedIDCard
      : updateOfficialDownloadedIDCard;
    const { result, error } = await updateFunc(
      data.map((item) => item.id),
      champId
    );
    if (error) {
      toast.error("Error when marking rows", { id: toastId });
      return;
    }
    toast.success("ID Card berhasil diproses", { id: toastId });

    if (!downloadAll) {
      router.refresh();
    }
    saveAs(blob, "bulk-images.zip");
  };

  return (
    <div>
      <Button onClick={handleBulkDownload} className="mb-1">
        Download Semua
      </Button>

      <div className="flex gap-2 flex-wrap">
        {data.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="min-w-[30rem] max-w-[30rem] relative id_card"
          >
            <img
              src={
                isAthlete
                  ? `/images/championships/${champId}/athlete_id_card.png`
                  : `/images/championships/${champId}/official_id_card.png`
              }
            />

            {item.image && (
              <img
                src={item.image}
                crossOrigin="anonymous"
                className="absolute top-[24.6%] left-1/2 -translate-x-1/2 w-[32%] aspect-[3/4] object-cover rounded border-2 border-blue-950"
              />
            )}

            <p
              className={`absolute bottom-[36%] left-1/2 -translate-x-1/2 font-extrabold ${
                item.name.length > 30
                  ? "text-sm"
                  : item.name.length > 25
                  ? "text-base"
                  : "text-base"
              } w-full text-center`}
            >
              {item.name.toUpperCase()}
            </p>

            <p
              className={`absolute bottom-[26%] left-1/2 -translate-x-1/2 font-extrabold ${
                item.contingent_name.length > 30
                  ? "text-sm"
                  : item.contingent_name.length > 25
                  ? "text-base"
                  : "text-lg"
              } w-full text-center`}
            >
              {item.contingent_name.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
