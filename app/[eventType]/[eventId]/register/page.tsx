import { notFound, redirect } from "next/navigation";

type Props = {
  params: {
    eventType: string;
    eventId: string;
  };
};

const page = ({ params }: Props) => {
  const { eventType } = params;
  if (eventType != "championship") return notFound();

  redirect("register/contingent");
};
export default page;
