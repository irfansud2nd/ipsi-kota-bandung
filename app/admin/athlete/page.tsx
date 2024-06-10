import { countAthlete } from "@/lib/athlete/external/athleteActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = async () => {
  const athleteCount = await countAthlete();
  return (
    <div className="flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Jumlah Atlet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-2xl font-bold">{athleteCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default page;
