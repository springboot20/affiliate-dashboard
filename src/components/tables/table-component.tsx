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

// const getNestedValue = (obj: any, accessor: string, deepAccessors?: string[]) => {
//   try {
//     // If we have a complex object with deep accessors
//     if (deepAccessors && deepAccessors.length > 0) {
//       // First get the parent object using the accessor
//       const parentObj = obj[accessor];
//       if (!parentObj || typeof parentObj !== 'object') return '-';

//       // Map through the deep accessors and join them
//       return deepAccessors
//         .map((deep) => {
//           const value = parentObj[deep];
//           return value !== undefined && value !== null ? value : '-';
//         })
//         .join(' ');
//     }

//     // Simple direct access
//     const value = obj[accessor];

//     // Handle different types of values
//     if (value === undefined || value === null) return '-';
//     if (typeof value === 'object') return JSON.stringify(value);
//     return value;
//   } catch (error) {
//     console.error('Error accessing property:', error);
//     return '-';
//   }
// };

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

          {actions && <th className='text-[#272727] capitalize'>action</th>}
        </tr>
      </thead>

      <tbody>
        {React.Children.toArray(
          datum?.map((row) => {
            return (
              <tr>
                {React.Children.toArray(
                  columns?.map((column) => {
                    return (
                      <td>
                        {column?.deepOneAccessorAlt ? (
                          row[column?.deepOneAccessorAlt]
                        ) : column?.deepOneAccessor ? (
                          <>
                            {column?.deepOneAccessor?.map((it) => (
                              <>{row?.[column?.accessor]?.[it]} </>
                            ))}
                          </>
                        ) : column?.type === 'Date' ? (
                          moment(row[column.accessor]).format('Do MMMM, YYYY')
                        ) : (
                          row[column.accessor]
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
