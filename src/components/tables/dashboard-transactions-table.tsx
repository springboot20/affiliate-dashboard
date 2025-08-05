import { classNames, formatMoney } from "@/utils";
import moment from "moment";
import React from "react";
import { ArrowDownIcon, ArrowUpIcon } from "../icons/Icons";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface DashboardTransactionTableProps {
  columns: DashboardTransactionTableColumnProps[];
  actions?: JSX.Element | ((row: any) => JSX.Element);
  isLoading: boolean;
  datum: any[];
}

interface DashboardTransactionTableColumnProps {
  header: string;
  accessor: string;
  type?: string;
  deepOneAccessor?: string[];
  deepOneAccessorAlt?: string;
}

const getNesteAccessorObject = (
  dataObject: Record<string, any>,
  accessor: string,
  deepAccessors?: string[]
) => {
  if (deepAccessors && deepAccessors.length !== 0) {
    const deepObject = dataObject[accessor];
    if (!deepObject || typeof deepObject !== "object") return "-";

    const deep = deepAccessors.map((accessor) => {
      const accessorObject = deepObject[accessor];
      return accessorObject !== undefined && accessorObject !== null ? accessorObject : "-";
    });

    return deep;
  }

  const accessorObject = dataObject[accessor];

  if (!accessorObject || typeof accessorObject !== "object") return "-";

  if (typeof accessorObject === "object") return JSON.stringify(accessorObject);
  return accessorObject;
};

const getIconConfig = (type: string) => {
  switch (type) {
    case "DEPOSIT":
      return {
        icon: ArrowDownIcon,
        color: "text-sm font-medium text-affiliate-green",
      };

    case "TRANSFER":
    case "WITHDRAW":
      return {
        icon: ArrowUpIcon,
        color: "text-sm font-medium text-affiliate-red",
      };

    default:
      return {
        icon: ArrowUpIcon,
        color: "text-sm font-medium text-affiliate-red",
      };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "DEPOSIT":
      return {
        color: "bg-affiliate-green text-white",
      };

    case "TRANSFER":
    case "WITHDRAW":
      return {
        color: "bg-affiliate-red text-white",
      };

    default:
      return {
        color: "bg-affiliate-red text-white",
      };
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return {
        color: "bg-affiliate-green !text-white",
      };

    case "FAILED":
      return {
        color: "bg-affiliate-red !text-white",
      };

    case "PENDING":
      return {
        color: "bg-yellow-700 text-gray-600",
      };

    default:
      return {
        color: "bg-yellow-700 text-gray-600",
      };
  }
};

export const DashboardTransactionTable = ({
  datum,
  columns,
  isLoading,
  actions,
}: DashboardTransactionTableProps) => {
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

          {actions && <th className="text-[#272727] capitalize">receipt</th>}
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

                    if (column.deepOneAccessorAlt) {
                      cellContent = row?.[column.deepOneAccessorAlt];
                    } else if (column.deepOneAccessor) {
                      cellContent = getNesteAccessorObject(
                        row,
                        column.accessor,
                        column.deepOneAccessor
                      );
                    } else if (column.type === "Date" && row?.[column.accessor]) {
                      cellContent = moment(row?.[column.accessor]).format("Do MMMM, YYYY");
                    } else {
                      const value = row?.[column.accessor];
                      cellContent = value !== undefined && value !== null ? value : "-";
                    }

                    const Icon = getIconConfig(row?.["type"])?.icon;
                    const textColor = getIconConfig(row?.["type"])?.color;
                    const statusColor = getStatusConfig(row?.["status"])?.color;
                    const typeColor = getTypeConfig(row?.["type"])?.color;

                    console.log(row?.["type"]);

                    return (
                      <td
                        className={classNames(
                          "px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-auto"
                        )}
                      >
                        {column.header === "description" ? (
                          <div className="flex items-center gap-3">
                            <span className="border-2 border-[#718EBF] h-10 w-10 flex items-center justify-center rounded-full">
                              <Icon />
                            </span>

                            <h3 className="text-xs capitalize font-medium">{cellContent}</h3>
                          </div>
                        ) : column.header === "transaction ID" ? (
                          <span className="text-xs bg-gray-300 px-2 py-1 rounded">
                            {row?.[column.accessor]
                              ? `${cellContent.slice(0, 6)}...${cellContent.slice(-6)}`
                              : "N/A"}
                          </span>
                        ) : column.header === "type" ? (
                          <span
                            className={classNames(
                              "px-2 py-1 !font-medium !text-xs w-max !text-white rounded flex items-center gap-2",
                              typeColor
                            )}
                          >
                            {cellContent}
                          </span>
                        ) : column.header === "amount" ? (
                          <span className={classNames(textColor, "flex items-center space-x-1")}>
                            {row?.["type"] === "TRANSFER" || row?.["type"] === "WITHDRAW" ? (
                              <MinusIcon className="h-4" />
                            ) : (
                              <PlusIcon className="h-4" />
                            )}
                            {formatMoney(
                              cellContent ?? 0,
                              row?.["currency"] === "NGN" ? "NGN" : "USD",
                              row?.["currency"] === "NGN" ? "en-NG" : "en-US"
                            )}
                          </span>
                        ) : column.header === "status" ? (
                          <span
                            className={classNames(
                              "px-2 py-1 !font-medium !text-xs w-max rounded",
                              statusColor
                            )}
                          >
                            {cellContent}
                          </span>
                        ) : (
                          <span>{cellContent}</span>
                        )}
                      </td>
                    );
                  })
                )}

                {actions && (
                  <td key={row["_id"]} className="px-2 py-4 border-b text-[#0B2239] min-w-[200px]">
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
