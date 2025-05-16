import { AccountType } from '@/types/account';
import React from 'react';
import moment from 'moment';

interface Column {
  header: string;
  accessor: string;
  type?: string;
}

type AccountTableListProps = {
  columns: Column[];
  datum: AccountType[];
  actions?: JSX.Element | ((row: any) => JSX.Element);
};

export const AccountTableListComponent = ({ datum, columns, actions }: AccountTableListProps) => {
  console.log(datum, columns);

  return (
    <table className='!w-full table-aut0 p-1 border-t border-[#D9DCE7] overflow-x-scroll app'>
      <thead>
        <tr>
          {React.Children.toArray(
            columns.map((column) => {
              return <th className='text-[#272727] capitalize'>{column.header}</th>;
            })
          )}

          {actions && <th className='text-[#272727] capitalize'>action</th>}
        </tr>
      </thead>

      <tbody>
        {React.Children.toArray(
          datum?.map((row) => {
            return (
              <tr>
                {React.Children.toArray(
                  columns?.map((column) => (
                    <td>
                      {column?.type === 'Date'
                        ? moment(row.account[column.accessor]).format('Do MMMM, YYYY')
                        : row.account[column.accessor]}
                    </td>
                  ))
                )}
                {actions && (
                  <td className='px-2 py-4 border-b text-[#0B2239] min-w-[200px]'>
                    {typeof actions === 'function' ? actions(row) : actions}
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
