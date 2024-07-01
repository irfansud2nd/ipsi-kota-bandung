import RefreshButton from "./RefreshButton";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

type Props = {
  title: string;
  count: number | string;
  className?: string;
  withoutRefresh?: boolean;
};

const CountDisplay = ({ title, count, className, withoutRefresh }: Props) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-y-3">
          <p className="text-center text-2xl font-bold">{count}</p>
          <RefreshButton />
        </CardContent>
      </Card>
    </div>
  );
};
export default CountDisplay;
