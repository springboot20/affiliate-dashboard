import { AccountType } from "@/types/account";
import { classNames } from "@/utils";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { CheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

export const SelectionComponent: React.FC<{
  options: AccountType[];
  isLoading: boolean;
  onChange: (value: AccountType) => void;
  placeholder: string;
  selectedId?: string;
  selectedUser: AccountType;
  query: string;
  handleSetQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  options = [],
  onChange,
  placeholder,
  selectedId = "",
  isLoading,
  selectedUser,
  query,
  handleSetQuery,
}) => {
  const [localOptions, setLocalOptions] = useState<AccountType[]>([]);

  useEffect(() => {
    if (!isLoading) {
      setLocalOptions(options);
    }
  }, [options, isLoading]);

  console.log(selectedId);

  const filteredOptions =
    query === ""
      ? localOptions
      : localOptions?.filter((account) => account?.account_number.toString().includes(query));

  const handleSelectionChange = (selectedOptions: AccountType) => {
    onChange(selectedOptions);
  };

  return (
    <Combobox className="w-full" as="div" onChange={handleSelectionChange} value={selectedUser}>
      <div className="relative">
        <ComboboxButton className="w-full">
          <ComboboxInput
            onChange={handleSetQuery}
            placeholder={placeholder}
            value={query}
            className="w-full px-3 py-3  text-gray-800 font-medium text-sm block rounded border border-gray-200 dark:outline-white/10 placeholder:text-gray-700 dark:placeholder:text-gray-400 focus:ring-1 focus:ring-indigo-600"
          />
        </ComboboxButton>
        {/* <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-8 w-8 text-gray-700 dark:text-gray-300"
            aria-hidden="true"
          />
        </ComboboxButton> */}

        {filteredOptions?.length > 0 ? (
          !filteredOptions.length && !isLoading ? (
            <div className="px-4 py-2 text-gray-500">No eligible accounts found</div>
          ) : (
            <ComboboxOptions className="border border-gray-400 bg-white absolute z-10 mt-2 p-2 max-h-[12rem] w-full overflow-x-hidden overflow-y-auto rounded-sm dark:bg-black text-base shadow-lg ring-opacity-5 focus:outline-none sm:text-sm">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3 h-full">
                  <div aria-label="Loading..." role="status">
                    <svg className="h-7 w-7 animate-spin" viewBox="3 3 18 18">
                      <path
                        className="fill-white"
                        d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
                      ></path>
                      <path
                        className="fill-[#4632A8]"
                        d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-500">loading seats...</span>
                </div>
              ) : (
                filteredOptions
                  // ?.filter((opt) => opt?.account_number !== query)
                  ?.map((opt) => {
                    return (
                      <ComboboxOption
                        key={opt._id}
                        disabled={opt._id === selectedId || opt._id === selectedUser?._id}
                        value={opt}
                        className={({ focus }) =>
                          classNames(
                            "cursor-pointer relative rounded-2xl select-none py-4 pl-3 pr-9 dark:text-white",
                            focus ? "bg-gray-200 dark:bg-white/5 text-gray-700 " : "text-gray-800"
                          )
                        }
                      >
                        {({ focus, selected }) => (
                          <>
                            <div className="flex items-center gap-3">
                              {opt?.user?.avatar?.url ? (
                                <div className="overflow-hidden size-7 rounded-full border border-gray-400">
                                  <img
                                    src={opt?.user?.avatar?.url}
                                    alt={`${opt?.user?.lastname} ${opt?.user?.firstname}`}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                              ) : (
                                <span className="shrink-0 flex justify-center items-center size-7 border border-gray-400 bg-gray-50 rounded-full">
                                  <UserIcon className="h-4 fill-gray-600" />
                                </span>
                              )}
                              <span
                                className={classNames(
                                  "block truncate",
                                  selected ? "font-semibold" : ""
                                )}
                              >
                                {opt?.user.firstname} {opt?.user.lastname}
                              </span>
                            </div>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  focus ? "text-green-400" : "text-green-600"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  strokeWidth={2.5}
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </ComboboxOption>
                    );
                  })
              )}
            </ComboboxOptions>
          )
        ) : undefined}
      </div>
    </Combobox>
  );
};
