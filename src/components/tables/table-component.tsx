import React from "react";

export type TableProps = {
  account: number;
  account_name: string;
  referenc_id: string;
  date: string;
  description: string;
  [key: string]: any;
};

export const TableComponent =
  () => {
    const heads =
      [
        "account",
        "name",
        "reference no",
        "date",
        "description",
      ];

    return (
      <table className="!w-full table-aut0 p-1 border-t border-[#D9DCE7] overflow-x-scroll">
        <thead>
          <tr>
            {React.Children.toArray(
              heads.map(
                (
                  head
                ) => {
                  return (
                    <th className="text-[#272727] capitalize">
                      {
                        head
                      }
                    </th>
                  );
                }
              )
            )}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              3127809342
            </td>
            <td>
              fredrick
            </td>
            <td>
              1569074382
            </td>
            <td>
              2023/11/04
            </td>
            <td>
              for
              contract
            </td>
          </tr>
          <tr>
            <td>
              3127809342
            </td>
            <td>
              fredrick
            </td>
            <td>
              1569074382
            </td>
            <td>
              2023/10/23
            </td>
            <td>
              work
            </td>
          </tr>
          <tr>
            <td>
              3127809342
            </td>
            <td>
              fredrick
            </td>
            <td>
              1569074382
            </td>
            <td>
              2023/10/12
            </td>
            <td>
              for
              contract
            </td>
          </tr>
          <tr>
            <td>
              3127809342
            </td>
            <td>
              fredrick
            </td>
            <td>
              1569074382
            </td>
            <td>
              2023/09/29
            </td>
            <td>
              contract
              extention
            </td>
          </tr>
        </tbody>
      </table>
    );
  };
