import { Championship, Event } from "@/lib/event/eventConstants";
import { imageMaxSize, imageSchema } from "@/lib/form/formConstants";
import { formatDate } from "@/lib/functions";
import Link from "next/link";
import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { FaClock, FaRectangleList, FaUser } from "react-icons/fa6";
import { IoDocumentText, IoLocationSharp } from "react-icons/io5";
import RichTextDisplay from "../ui/RichTextDisplay";

type Props = {
  event: Event;
  preview?: boolean;
};

const EventDisplay = ({ event, preview }: Props) => {
  let showImage = event.image.downloadUrl.length > 0;
  let imageUrl = event.image.downloadUrl;

  if (!preview) {
    showImage = true;
  } else if (
    event.image.file &&
    imageSchema(imageMaxSize.event).isValidSync(event.image.file)
  ) {
    showImage = true;
    imageUrl = URL.createObjectURL(event.image.file);
  }

  let infos = [
    {
      label: "Penyelenggara",
      icon: <FaUser />,
      content: event.organizer.length ? event.organizer : "IPSI Kota Bandung",
    },
    {
      label: "Lokasi",
      icon: <IoLocationSharp />,
      content: event.location_url ? (
        <Link
          href={event.location_url}
          className="hover:text-primary transition"
          target="_blank"
        >
          {event.location_name}
        </Link>
      ) : (
        event.location_name
      ),
    },
    {
      label: "Tanggal Event",
      icon: <FaCalendarAlt />,
      content: (
        <span className="whitespace-nowrap">
          {formatDate(event.date_start, {
            longMonth: true,
            withoutHour: true,
            withoutYear: event.date_end != 0,
          })}
          {event.date_end
            ? ` - ${formatDate(event.date_end, {
                longMonth: true,
                withoutHour: true,
              })}`
            : null}
        </span>
      ),
    },
    {
      label: "Waktu Event",
      icon: <FaClock />,
      content: (
        <span>
          {formatDate(event.time_start, { hourOnly: true })}
          {event.time_end
            ? ` - ${formatDate(event.time_end, {
                hourOnly: true,
              })} WIB`
            : " WIB - selesai"}
        </span>
      ),
    },
  ];

  const championship =
    (event as Championship).register !== undefined
      ? (event as Championship)
      : undefined;

  if (championship) {
    infos = infos.filter((info) => info.label !== "Waktu Event");
    const championshipInfos = [
      {
        label: "Waktu Pendaftaran",
        icon: <FaCalendarAlt />,
        content: (
          <span className="whitespace-nowrap">
            {formatDate(championship.register.start, {
              longMonth: true,
              withoutHour: true,
              withoutYear: championship.register.end != 0,
            })}
            {" - "}
            {formatDate(championship.register.end, {
              longMonth: true,
              withoutHour: true,
            })}
          </span>
        ),
      },
      {
        label: "Technical Meeting",
        icon: <FaCalendarAlt />,
        content: (
          <span className="whitespace-nowrap">
            {formatDate(championship.techmeet.date, {
              longMonth: true,
            })}
          </span>
        ),
      },
      {
        label: "Proposal",
        icon: <IoDocumentText />,
        content: championship.proposal ? (
          <Link
            href={championship.proposal}
            className="hover:text-green-400 transition"
          >
            Klik disini
          </Link>
        ) : (
          <span className="text-muted-foreground">Belum tersedia</span>
        ),
      },
      {
        label: "Link Pendaftaran",
        icon: <FaRectangleList />,
        content:
          Date.now() < championship.register.start ? (
            <span className="text-muted-foreground">Belum dibuka</span>
          ) : Date.now() > championship.date_end ? (
            <span className="text-muted-foreground">
              Kejuaraan telah berakhir
            </span>
          ) : (
            <Link
              href={`/championship/${championship.id}/register`}
              className="hover:text-green-400 transition"
            >
              Klik disini
            </Link>
          ),
      },
    ];

    infos = infos.concat(championshipInfos);
  }

  return (
    <div className="border-b-2 pb-2">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 grid-rows-1 max-md:grid-rows-[auto_1fr] gap-x-5">
        {showImage ? (
          <img
            src={imageUrl}
            className="w-full h-fit my-auto aspect-video col-span-2 rounded-xl object-cover object-center border"
          />
        ) : (
          <div className="w-full h-fit my-auto bg-gray-200 aspect-video flex justify-center items-center text-5xl font-extrabold col-span-2 rounded-xl">
            IMAGE
          </div>
        )}
        <div className="flex flex-col w-full">
          <h1 className="text-3xl font-bold border-b-2 pb-3 mb-3">
            {event.title}
          </h1>
          <div className=" flex flex-col justify-around flex-grow">
            {infos.map((info) => (
              <div className="flex items-center gap-4" key={info.label}>
                {React.cloneElement(info.icon, {
                  className: "w-5 h-5 min-w-5 min-h-5 text-green-500",
                })}
                <p>
                  <span className="font-semibold text-lg">{info.label}</span>
                  <br />
                  {info.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {event.description.length ? (
        <div className="mt-5">
          <h3 className="font-bold text-xl">Tentang {event.title}</h3>
          <RichTextDisplay
            className="text-justify"
            text={event.description}
            fallback="Konten"
          />
        </div>
      ) : null}
    </div>
  );
};
export default EventDisplay;
