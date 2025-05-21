import React from 'react';
import moment from 'moment';
import { classNames, formatMoney } from '@/utils';

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
};

const getNestedValue = (obj: any, accessor: string, deepAccessors?: string[]) => {
  try {
    // If we have a complex object with deep accessors
    if (deepAccessors && deepAccessors.length > 0) {
      // First get the parent object using the accessor
      const parentObj = obj[accessor];
      if (!parentObj || typeof parentObj !== 'object') return '-';

      // Map through the deep accessors and join them
      return deepAccessors
        .map((deep) => {
          const value = parentObj[deep];
          return value !== undefined && value !== null ? value : '-';
        })
        .join(' ');
    }

    // Simple direct access
    const value = obj[accessor];

    // Handle different types of values
    if (value === undefined || value === null) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  } catch (error) {
    console.error('Error accessing property:', error);
    return '-';
  }
};

export const TableComponent = ({ datum, columns, actions }: AccountTableListProps) => {
  console.log(datum, columns);

  return (
    <table className='!w-full table-aut0 p-1 border-t border-[#D9DCE7] app'>
      <thead>
        <tr>
          {React.Children.toArray(
            columns?.map((column) => {
              return <th className='text-[#272727] capitalize'>{column.header}</th>;
            })
          )}

          {actions && <th className='text-[#272727] capitalize'>actions</th>}
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
                    else if (column.type === 'Date' && row?.[column.accessor]) {
                      cellContent = moment(row?.[column.accessor]).format('Do MMMM, YYYY');
                    } else {
                      const value = row?.[column.accessor];
                      cellContent = value !== undefined && value !== null ? value : '-';
                    }

                    return (
                      <td
                        className={classNames('px-6 py-4 whitespace-nowrap text-sm text-gray-500')}>
                        {column.header === 'status' ? (
                          <span
                            className={classNames(
                              'px-2 py-1 !font-medium !text-xs w-max !text-white rounded-xl',
                              row['status'] === 'ACTIVE'
                                ? 'bg-green-500'
                                : row['status'] === 'SUSPENDED' || row['status'] === 'CLOSED'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                            )}>
                            {cellContent}
                          </span>
                        ) : column.header === 'balance' ? (
                          formatMoney(
                            cellContent as number,
                            row['wallet']?.currency === 'USD' ? 'USD' : 'NGN',
                            row['wallet']?.currency === 'USD' ? 'en-US' : 'en-NG'
                          )
                        ) : (
                          cellContent
                        )}
                      </td>
                    );
                  })
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
