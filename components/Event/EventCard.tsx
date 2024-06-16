import { Championship, Event } from "@/lib/event/eventConstants";
import Link from "next/link";
import { IoLocationSharp } from "react-icons/io5";
import { FaCalendarAlt, FaSignInAlt } from "react-icons/fa";
import { formatDate } from "@/lib/functions";
import { FaClock } from "react-icons/fa6";

type Props = {
  event: Event | Championship;
};
const EventCard = ({ event }: Props) => {
  const championship =
    (event as Championship).register !== undefined
      ? (event as Championship)
      : undefined;
  const link = `/${championship ? "championship" : "event"}/${event.id}`;

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
          className="text-xl font-semibold block mb-2 hover:text-green-500 transition"
        >
          {event.title}
        </Link>
        <div className="flex gap-2 items-center">
          <IoLocationSharp className="size-5 min-w-5 min-h-5 text-green-500" />
          {event.locationUrl ? (
            <Link
              href={event.locationUrl}
              className="hover:text-green-400 transition"
            >
              <span>{event.locationName}</span>
            </Link>
          ) : (
            <span>{event.locationName}</span>
          )}
        </div>
        <div className="border-t-2 mt-2 pt-2 flex justify-between items-center flex-wrap">
          <div className="flex items-center">
            <FaCalendarAlt className="size-5 mr-2 text-green-500" />
            <div className="flex items-center flex-wrap">
              <span className="whitespace-nowrap">
                {formatDate(event.dateStart, {
                  withoutHour: true,
                  longMonth: true,
                  withoutYear: !!event.dateEnd,
                })}
              </span>
              {event.dateEnd && (
                <>
                  <span> - </span>
                  <span className="whitespace-nowrap">
                    {formatDate(event.dateEnd, {
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
                className=" hover:text-green-500 transition flex gap-2 items-center"
              >
                <FaSignInAlt className="size-5 text-green-500" />
                Pendaftaran
              </Link>
            )
          ) : (
            <>
              <FaClock className="size-5 mr-2 ml-auto text-green-500" />
              <p>{formatDate(event.dateStart, { hourOnly: true })}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default EventCard;
