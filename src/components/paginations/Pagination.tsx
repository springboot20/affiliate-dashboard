import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { classNames } from "@/utils";

type PaginationProps = {
  prev: () => void;
  next: () => void;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  goToPage: (page: number) => void;
};

export const Pagination = ({
  next,
  prev,
  totalPages,
  hasNextPage,
  page,
  goToPage,
}: PaginationProps) => {
  return (
    <div className="relative mt-5 rounded-lg flex justify-end w-full">
      <div className="flex items-center lg:px-4 py-2 rounded-md gap-2">
        <button
          title={"previous"}
          onClick={prev}
          disabled={page === 1}
          className="flex items-center gap-1 !bg-transparent capitalize text-affiliate-deep-blue text-xs font-medium px-3"
        >
          <ChevronLeftIcon strokeWidth={2} className="h-5 w-5" /> Previous
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === page;

            return (
              <button
                type="button"
                onClick={() => goToPage(pageNumber)}
                className={classNames(
                  `flex items-center justify-center text-xs font-medium h-6 w-6 rounded-md`,
                  isActive
                    ? "text-white bg-affiliate-deep-blue "
                    : "text-affiliate-deep-blue !bg-transparent !shadow-none"
                )}
                key={index}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        <button
          title="next"
          className="flex items-center gap-1 !bg-transparent capitalize text-affiliate-deep-blue text-xs font-medium px-3"
          onClick={next}
          disabled={!hasNextPage}
        >
          Next <ChevronRightIcon strokeWidth={2} className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
