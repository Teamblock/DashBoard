import Image from "next/image";
import React, { useState } from "react";

// import CurrencySearchModal from "app/modals/SearchModal/CurrencySearchModal";
import Typography from "app/components/Typography";
import {
  classNames,
  formatNumber,
  maxAmountSpend,
  tryParseAmount,
  warningSeverity,
} from "app/functions";

import { Currency, Percent, ZERO } from "@sushiswap/core-sdk";
import BridgeCompo from "../../components/Bridge/BridgeCompo";
import OpenClaimsCompo from "../../components/Bridge/OpenClaimsCompo";

function index() {
  const [showBridge, setShowBridge] = useState(true);
  // interface SwapAssetPanel {
  //   error?: boolean;
  //   // @ts-ignore TYPE NEEDS FIXING
  //   header: (x) => React.ReactNode;
  //   // @ts-ignore TYPE NEEDS FIXING
  //   walletToggle?: (x) => React.ReactNode;
  //   currency?: Currency;
  //   currencies?: string[];
  //   value?: string;
  //   onChange(x?: string): void;
  //   onSelect?(x: Currency): void;
  //   spendFromWallet?: boolean;
  //   selected?: boolean;
  //   isItemShow?: boolean;
  //   priceImpact?: Percent;
  //   priceImpactCss?: string;
  //   disabled?: boolean;
  //   title?: string;
  //   className?: string;
  //   walletCLass?: string;
  //   currencyInputClass?: string;
  //   selectcurrencyClass?: string;
  //   popoverPanelClass?: string;
  //   transitionCss?: string;
  // }
  // const SwapAssetPanel = ({
  //   header,
  //   walletToggle,
  //   currency,
  //   value,
  //   onChange,
  //   onSelect,
  //   spendFromWallet,
  //   disabled,
  //   currencies,
  //   title,
  //   className,
  //   popoverPanelClass,
  //   transitionCss,
  // }: SwapAssetPanel) => {
  return (
    <div className="intro_section justify-center !items-start !h-full">
      <div className="bg-[#EAEAEA] h-auto my-10 w-[640px]">
        <div className="p-5 border-b-2 border-slate-300">
          <ul className="flex w-full border border-black rounded">
            <li className="w-1/2 text-center">
              <a
                href="#"
                aria-current="page"
                className="block p-2 text-white bg-black active dark:bg-black  border border-transparent rounded"
                onClick={() => {
                  setShowBridge(true);
                }}
              >
                Bridge
              </a>
            </li>
            <li className="w-1/2 text-center">
              <a
                href="#"
                className="block p-2 text-black rounded"
                onClick={() => {
                  setShowBridge(false);
                }}
              >
                Open Claims
              </a>
            </li>
          </ul>
        </div>
        {showBridge ? <BridgeCompo /> : <OpenClaimsCompo />}
      </div>
    </div>
  );
}

export default index;
