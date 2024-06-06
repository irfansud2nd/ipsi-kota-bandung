import { Championship, championships } from "@/lib/event/eventConstants";
import Container from "../ui/Container";
import { FaCalendarAlt } from "react-icons/fa";
import { formatDate } from "@/lib/functions";
import { Button } from "../ui/button";
import { IoDocumentText, IoLocationSharp } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";
import { FaRectangleList } from "react-icons/fa6";

const Card = ({ championship }: { championship: Championship }) => {
  const registrationDisabled = Date.now() <= championship.register.start;
  return (
    <div className="w-full bg-muted flex flex-col md:flex-row md:justify-between gap-y-3 items-center py-2 px-5 rounded-3xl">
      <div className="flex flex-col gap-1">
        <Link
          href={`/championship/${championship.id}`}
          className="font-semibold text-xl hover:text-primary mb-1 transition"
        >
          {championship.title}
        </Link>
        <Link
          href={championship.location.url || ""}
          className="hover:text-primary flex items-center transition"
          target="_blank"
        >
          <IoLocationSharp className="size-5 mr-2 text-primary" />
          {championship.location.name}
        </Link>
        {/* WAKTU PENDAFTARAN */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className="whitespace-nowrap flex items-center">
                <FaRectangleList className="size-5 mr-2 text-primary" />
                <span>
                  {formatDate(championship.register.start, {
                    withoutHour: true,
                    longMonth: true,
                    withoutYear: true,
                  })}
                </span>
                <span> - </span>
                <span>
                  {formatDate(championship.register.end, {
                    withoutHour: true,
                    longMonth: true,
                  })}
                </span>
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Waktu Pendaftaran</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* WAKTU EVENT */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <p className="whitespace-nowrap flex items-center">
                <FaCalendarAlt className="size-5 mr-2 text-primary" />
                <span>
                  {formatDate(championship.date.start, {
                    withoutHour: true,
                    longMonth: true,
                    withoutYear: true,
                  })}
                </span>
                {championship.date.end && (
                  <>
                    <span> - </span>
                    <span>
                      {formatDate(championship.date.end, {
                        withoutHour: true,
                        longMonth: true,
                      })}
                    </span>
                  </>
                )}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p>Waktu Event</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-col gap-3 max-md:w-full">
        {/* PROPOSAL */}
        <Button
          asChild={!!championship.proposal}
          disabled={!championship.proposal}
        >
          <Link href={championship.proposal} target="_blank">
            Proposal
          </Link>
        </Button>
        {/* REGISTRATION LINK */}
        <Button asChild={!registrationDisabled} disabled={registrationDisabled}>
          <Link href={`/championship/${championship.id}/register`}>
            Pendaftaran
          </Link>
        </Button>
      </div>
    </div>
  );
};

const OngoingChampionships = () => {
  const ongoingChampionships = championships.filter((item) => item.showOnHome);

  if (!ongoingChampionships.length) return null;

  return (
    <Container className="px-5 md:px-10 mb-10 flex flex-col gap-5">
      {ongoingChampionships.map((championship) => (
        <Card championship={championship} />
      ))}
    </Container>
  );
};
export default OngoingChampionships;
