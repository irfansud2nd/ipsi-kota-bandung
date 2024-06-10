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
  link: string;
  className?: string;
  disabled?: boolean;
};

const PagePagination = ({
  page,
  dataLength,
  limit,
  className,
  link,
  disabled,
}: Props) => {
  return (
    <Pagination className={className}>
      <PaginationContent>
        {!disabled && page > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={`${link}page=${page - 1}`}
              className="hover:bg-transparent"
            />
          </PaginationItem>
        )}
        <PaginationItem className="mx-2">Halaman : {page}</PaginationItem>
        {!disabled && dataLength >= limit && (
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
