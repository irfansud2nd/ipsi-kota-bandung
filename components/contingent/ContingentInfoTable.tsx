import { Table, TableBody, TableCell, TableRow } from "../ui/table";

type Info = {
  key: string;
  value: string | number;
};

const ContingentInfoTable = ({ data }: { data: Info[] }) => {
  return (
    <Table>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.key}>
            <TableCell className="font-medium">{item.key}</TableCell>
            <TableCell>{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default ContingentInfoTable;
