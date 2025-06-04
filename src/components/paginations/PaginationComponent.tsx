import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type PaginationProps = {
  setPage: (page: number) => void;
  prev: () => void;
  next: () => void;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  totalItems: number;
};

export const PaginationComponent = ({
  totalPages,
  setPage,
  page,
  next,
  prev,
  hasNextPage,
  totalItems,
}: PaginationProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-y-5 items-center sm:justify-between mt-4">
      <div className="flex text-xs font-medium text-gray-600 items-center space-x-3">
        <span>Items per page</span>
        <fieldset className="">
          <label htmlFor="page" className="sr-only">
            page number
          </label>
          <input
            type="text"
            id="page"
            name="page"
            className="px-2 rounded-sm py-1.5 w-0 !min-w-10 text-center bg-gray-50 border outline-none focus:ring-1 focus:ring-gray-500"
            value={page}
            onChange={(event) => {
              setPage(+event.target.value);
            }}
          />
        </fieldset>
        <span> 1 - 10 of {totalItems} </span>
      </div>

      <div className="flex items-center space-x-3">
        <button
          className="flex items-center text-xs gap-2 font-medium text-gray-600"
          title="previous transaction"
          onClick={prev}
          disabled={page === 1}
        >
          <ChevronLeftIcon className="h-4" />
          Previous
        </button>

        <div className="text-xs flex items-center space-x-2 text-gray-600 font-medium">
          <fieldset className="">
            <label htmlFor="page" className="sr-only">
              page number
            </label>
            <input
              type="text"
              id="page"
              name="page"
              className="px-2 rounded-sm py-1.5 w-0 !min-w-10 text-center bg-gray-50 border outline-none focus:ring-1 focus:ring-gray-500"
              value={page}
              onChange={(event) => {
                setPage(+event.target.value);
              }}
            />
          </fieldset>
          <span>of {totalPages}</span>
        </div>

        <button
          className="flex items-center text-xs gap-2 font-medium text-gray-600"
          title="previous transaction"
          onClick={next}
          disabled={!hasNextPage}
        >
          Next
          <ChevronRightIcon className="h-4" />
        </button>
      </div>
    </div>
  );
};
