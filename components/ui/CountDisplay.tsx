import { Card, CardContent, CardHeader, CardTitle } from "./card";

type Props = {
  title: string;
  count: number | string;
  className?: string;
};

const CountDisplay = ({ title, count, className }: Props) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-2xl font-bold">{count}</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default CountDisplay;
