import React from "react";
import moment from "moment";
import { classNames, formatMoney } from "@/utils";
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from "@heroicons/react/24/outline";

interface Column {
  header: string;
  accessor: string;
  type?: string;
  deepOneAccessor?: string[];
  deepOneAccessorAlt?: string;
}

type AccountTableListProps = {
  columns: Column[];
  datum: any[];
  actions?: JSX.Element | ((row: any) => JSX.Element);
  isLoading: boolean;
};

const getNestedValue = (obj: any, accessor: string, deepAccessors?: string[]) => {
  try {
    // If we have a complex object with deep accessors
    if (deepAccessors && deepAccessors.length > 0) {
      // First get the parent object using the accessor
      const parentObj = obj[accessor];
      if (!parentObj || typeof parentObj !== "object") return "-";

      // Map through the deep accessors and join them
      return deepAccessors
        .map((deep) => {
          const value = parentObj[deep];
          return value !== undefined && value !== null ? value : "-";
        })
        .join(" ");
    }

    // Simple direct access
    const value = obj[accessor];

    // Handle different types of values
    if (value === undefined || value === null) return "-";
    if (typeof value === "object") return JSON.stringify(value);
    return value;
  } catch (error) {
    console.error("Error accessing property:", error);
    return "-";
  }
};

export const TableComponent = ({ datum, columns, actions, isLoading }: AccountTableListProps) => {
  return isLoading || !datum?.length || !datum ? (
    <div className="flex justify-center items-center h-[50vh] min-w-full shrink-0">
      <div aria-label="Loading..." role="status">
        <svg className="h-7 w-7 animate-spin" viewBox="3 3 18 18">
          <path
            className="fill-white"
            d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
          ></path>
          <path
            className="fill-gray-800"
            d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
          ></path>
        </svg>
      </div>
      <span className="ml-2">loading...</span>
    </div>
  ) : (
    <table className="!w-full table-auto p-1 border-t border-[#D9DCE7] app">
      <thead>
        <tr>
          {React.Children.toArray(
            columns?.map((column) => {
              return <th className="text-[#272727] capitalize">{column.header}</th>;
            })
          )}

          {actions && <th className="text-[#272727] capitalize">actions</th>}
        </tr>
      </thead>

      <tbody>
        {React.Children.toArray(
          datum?.map((row) => {
            return (
              <tr>
                {React.Children.toArray(
                  columns.map((column) => {
                    let cellContent;

                    // Handle deepOneAccessorAlt
                    if (column.deepOneAccessorAlt) {
                      cellContent = row?.[column.deepOneAccessorAlt];
                    }
                    // Handle deepOneAccessor array
                    else if (column.deepOneAccessor) {
                      cellContent = getNestedValue(row, column.accessor, column.deepOneAccessor);
                    }
                    // Handle Date type
                    else if (column.type === "Date" && row?.[column.accessor]) {
                      cellContent = moment(row?.[column.accessor]).format("Do MMMM, YYYY");
                    } else {
                      const value = row?.[column.accessor];
                      cellContent = value !== undefined && value !== null ? value : "-";
                    }

                    return (
                      <td
                        className={classNames("px-6 py-4 whitespace-nowrap text-sm text-gray-500")}
                      >
                        {column.header === "status" ? (
                          <span
                            className={classNames(
                              "px-2 py-1 !font-medium !text-xs w-max !text-white rounded-xl",
                              row["status"] === "ACTIVE" || row["status"] === "COMPLETED"
                                ? "bg-green-500"
                                : row["status"] === "SUSPENDED" ||
                                  row["status"] === "CLOSED" ||
                                  row["status"] === "FAILED"
                                ? "bg-red-500"
                                : "bg-yellow-700 text-gray-600"
                            )}
                          >
                            {cellContent}
                          </span>
                        ) : column.header === "balance" || column.header === "amount" ? (
                          formatMoney(
                            cellContent as number,
                            row["wallet"]?.currency === "USD" ? "USD" : "NGN",
                            row["wallet"]?.currency === "USD" ? "en-US" : "en-NG"
                          )
                        ) : column.header === "type" &&
                          ["DEPOSIT", "TRANSFER"].includes(row["type"]) ? (
                          <span
                            className={classNames(
                              ["DEPOSIT", "TRANSFER"].includes(row["type"]) &&
                                "px-2 py-1 !font-medium !text-xs w-max !text-white rounded-xl flex items-center gap-2",
                              row["type"] === "DEPOSIT"
                                ? "bg-green-500"
                                : row["type"] === "TRANSFER"
                                ? "bg-red-500"
                                : ""
                            )}
                          >
                            {cellContent}
                            {row["type"] === "DEPOSIT" ? (
                              <ArrowDownCircleIcon className="h-4" />
                            ) : row["type"] === "TRANSFER" ? (
                              <ArrowUpCircleIcon className="h-4" />
                            ) : null}
                          </span>
                        ) : (
                          cellContent
                        )}
                      </td>
                    );
                  })
                )}

                {actions && (
                  <td className="px-2 py-4 border-b text-[#0B2239] min-w-[200px]">
                    {typeof actions === "function" ? actions(row) : actions}
                  </td>
                )}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};
