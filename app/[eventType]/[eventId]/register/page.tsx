import { notFound } from "next/navigation";

type Props = {
  params: {
    eventType: string;
    eventId: string;
  };
};

const page = ({ params }: Props) => {
  const { eventType, eventId } = params;
  if (eventType != "championship") return notFound();
  return (
    <div>
      <p>{eventType}</p>
      <p>{eventId}</p>
    </div>
  );
};
export default page;
