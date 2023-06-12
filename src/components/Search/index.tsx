import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { classNames } from "app/functions";
import React, { FC } from "react";
import { Search as SearchIcon } from "react-feather";

interface Search {
  term: string;
  search(value: string): void;
  searchBarCss?: string;
}

const Search: FC<Search> = ({ term, search, searchBarCss }) => {
  const { i18n } = useLingui();

  return (
    <div className="flex flex-grow items-center gap-4 w-full sm:w-auto">
      <div
        className={classNames(
          "focus-within:ring-1 ring-primary/90 flex flex-grow border border-1 border-gray-500 gap-2 items-center rounded-[0.350rem] py-2 px-3 w-full sm:w-auto !bg-[#4F4F4F]",
          searchBarCss
        )}
      >
        <SearchIcon strokeWidth={3} width={20} height={20} />
        <input
          className="bg-transparent !text-black/80 w-full placeholder:text-black/70"
          placeholder={i18n._(t`Search by token or pair`)}
          onChange={(e) => search(e.target.value)}
          value={term}
        />
      </div>
    </div>
  );
};

export default Search;
