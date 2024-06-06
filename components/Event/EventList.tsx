import Container from "../ui/Container";
import EventCard from "./EventCard";
import { Button } from "../ui/button";
import Link from "next/link";
import { Championship, Event } from "@/lib/event/eventConstants";

type Props = {
  events: (Event | Championship)[];
  onHome?: boolean;
  championship?: boolean;
};

const EventList = ({ onHome, events, championship }: Props) => {
  return (
    <Container
      className={`h-fit transition
      ${
        onHome &&
        ` px-5 md:px-10 -mt-20 pt-10 rounded-t-[50px] md:rounded-t-[80px] ${
          championship ? "bg-yellow-200 pb-20" : "bg-green-200"
        }`
      }
      
      `}
    >
      {onHome && (
        <h2 className="font-semibold text-3xl mb-3">
          {championship ? "Kejuaraan" : "Event"}
        </h2>
      )}
      {events.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {events?.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      ) : (
        <p>Tidak ada event.</p>
      )}
      {onHome && (
        <Button
          className={`my-5 rounded-full tracking-wide text-white bg-gradient-to-br font-semibold text-base hover:drop-shadow-xl hover:-translate-y-2 hover:brightness-110 transition-all
          ${
            championship
              ? "from-yellow-900 to-yellow-500"
              : "from-green-900 to-green-500"
          }
          `}
          asChild
        >
          <Link href={championship ? "/championship" : "/event"}>
            Lihat Semua {championship ? "Kejuaraan" : "Event"}
          </Link>
        </Button>
      )}
    </Container>
  );
};
export default EventList;
