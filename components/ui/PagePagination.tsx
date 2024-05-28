import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  dataLength: number;
  limit: number;
  className?: string;
  link: string;
};

const PagePagination = ({
  page,
  dataLength,
  limit,
  className,
  link,
}: Props) => {
  return (
    <Pagination className={className}>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`${link}page=${page - 1}`}
              className="hover:bg-transparent"
            />
          </PaginationItem>
        )}
        <PaginationItem className="mx-2">{page}</PaginationItem>
        {dataLength >= limit && (
          <PaginationItem>
            <PaginationNext
              href={`${link}page=${page + 1}`}
              className="hover:bg-transparent"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
export default PagePagination;
