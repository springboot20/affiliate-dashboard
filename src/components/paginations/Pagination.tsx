import { Button, IconButton, IconButtonProps } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { classNames } from "@/utils";

export const Pagination = () => {
  const [page, setPage] = useState(1);

  let totalPages = 4;

  const getItemProps = (index: number) => ({
    variant: 3 === index ? "filled" : ("text" as IconButtonProps["variant"]),
    className: classNames(
      `flex items-center justify-center text-xs font-medium`,
      page === index ? "text-white bg-affiliate-deep-blue " : "text-affiliate-deep-blue !bg-transparent !shadow-none"
    ),
    // color: "text-affiliate-deep-blue",
    onClick: () => console.log("clicked"),
    children: index + 1,
  });

  const next = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="relative mt-5 rounded-lg flex justify-end w-full">
      <div className="flex items-center lg:px-4 py-2 rounded-md gap-2">
        <Button
          placeholder={"previous"}
          onClick={prev}
          variant="text"
          className="flex items-center gap-1 !bg-transparent capitalize text-affiliate-deep-blue text-xs font-medium px-3"
          onPointerEnterCapture={undefined}
          ripple={false}
          onPointerLeaveCapture={undefined}
        >
          <ChevronLeftIcon strokeWidth={2} className="h-5 w-5" /> Previous
        </Button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <IconButton
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              placeholder={""}
              key={index}
              {...getItemProps(index + 1)}
            >
              {index + 1}
            </IconButton>
          ))}
        </div>
        <Button
          placeholder={"next"}
          variant="text"
          className="flex items-center gap-1 !bg-transparent capitalize text-affiliate-deep-blue text-xs font-medium px-3"
          onClick={next}
          ripple={false}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Next <ChevronRightIcon strokeWidth={2} className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
