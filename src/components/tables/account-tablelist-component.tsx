import React from 'react';
import moment from 'moment';

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
                  columns.map((column) => {
                    let cellContent;

                    // Handle deepOneAccessorAlt
                    if (column.deepOneAccessorAlt) {
                      cellContent = row.account?.[column.deepOneAccessorAlt];
                    }
                    // Handle deepOneAccessor array
                    else if (column.deepOneAccessor) {
                      cellContent = getNestedValue(
                        row.account,
                        column.accessor,
                        column.deepOneAccessor
                      );
                    }
                    // Handle Date type
                    else if (column.type === 'Date' && row.account?.[column.accessor]) {
                      cellContent = moment(row.account?.[column.accessor]).format('Do MMMM, YYYY');
                    }
                    // Direct access
                    else {
                      const value = row.account?.[column.accessor];

                      // Handle 'user' object specifically to avoid React child rendering errors
                      if (
                        column.accessor === 'user' &&
                        typeof value === 'object' &&
                        value !== null
                      ) {
                        cellContent =
                          `${value.firstname || ''} ${value.lastname || ''}`.trim() ||
                          value._id ||
                          '-';
                      } else {
                        cellContent = value !== undefined && value !== null ? value : '-';
                      }
                    }

                    return (
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {cellContent}
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
