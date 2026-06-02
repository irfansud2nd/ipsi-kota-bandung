import { Championship, Event } from "@/lib/event/eventConstants";
import Link from "next/link";
import { IoLocationSharp } from "react-icons/io5";
import { FaCalendarAlt, FaSignInAlt } from "react-icons/fa";
import { formatDate } from "@/lib/functions";
import { FaClock } from "react-icons/fa6";

type Props = {
  event: Event | Championship;
  onAdmin?: boolean;
};
const EventCard = ({ event, onAdmin }: Props) => {
  const championship =
    (event as Championship).register !== undefined
      ? (event as Championship)
      : undefined;
  const link = `${onAdmin ? "/admin/" : "/"}${
    championship ? "championship" : "event"
  }/${event.id}`;

  // COLOR_CHANGE GREEN-500 -> #419EBD

  return (
    <div className="rounded-lg bg-muted overflow-hidden hover:drop-shadow-lg hover:-translate-y-1 transition-all">
      <Link href={link}>
        <img
          src={event.image.downloadUrl}
          className="w-full aspect-video object-cover object-center"
        />
      </Link>
      <div className="p-3">
        <Link
          href={link}
          className="text-xl font-semibold block mb-2 hover:text-[#419EBD] transition"
        >
          {event.title}
        </Link>
        <div className="flex gap-2 items-center">
          <IoLocationSharp className="size-5 min-w-5 min-h-5 text-[#419EBD]" />
          {event.location_url ? (
            <Link
              href={event.location_url}
              className="hover:text-green-400 transition"
            >
              <span>{event.location_name}</span>
            </Link>
          ) : (
            <span>{event.location_name}</span>
          )}
        </div>
        <div className="border-t-2 mt-2 pt-2 flex justify-between items-center flex-wrap">
          <div className="flex items-center">
            <FaCalendarAlt className="size-5 mr-2 text-[#419EBD]" />
            <div className="flex items-center flex-wrap">
              <span className="whitespace-nowrap">
                {formatDate(event.date_start, {
                  withoutHour: true,
                  longMonth: true,
                  withoutYear: !!event.date_end,
                })}
              </span>
              {event.date_end && (
                <>
                  <span> - </span>
                  <span className="whitespace-nowrap">
                    {formatDate(event.date_end, {
                      withoutHour: true,
                      longMonth: true,
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
          {championship ? (
            championship.register.start <= Date.now() &&
            championship.register.end >= Date.now() && (
              <Link
                href={`/championship/${event.id}/register`}
                className=" hover:text-[#419EBD] transition flex gap-2 items-center"
              >
                <FaSignInAlt className="size-5 text-[#419EBD]" />
                Pendaftaran
              </Link>
            )
          ) : (
            <>
              <FaClock className="size-5 mr-2 ml-auto text-[#419EBD]" />
              <p>{formatDate(event.time_start, { hourOnly: true })}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default EventCard;
