import React from "react";
import {
  CoinGeckoIcon,
  CoinmarketcapIcon,
  DiscordIcon,
  MediumIcon,
  Meduim2Icon,
  TelegramIcon,
  TwitterIcon,
} from "app/components/Icon";
import { classNames } from "app/functions";

interface FooterIconsProps {
  footerIconsCss?: string;
}

const FooterIcons: React.FC<FooterIconsProps> = ({ footerIconsCss }) => {
  return (
    <div className={classNames("flex items-center gap-6", footerIconsCss)}>
      <div className="flex items-center justify-around w-full max-w-[15rem]">
        <a href="https://twitter.com/thoughtwin">
          <TwitterIcon className="text-black cursor-pointer w-[33px]" />
        </a>
        <a href="https://m.facebook.com/thoughtwin">
          <Meduim2Icon className="text-black cursor-pointer w-[33px]" />
        </a>
        <a href="https://in.linkedin.com/company/thoughtwin">
          <TelegramIcon className="!text-black cursor-pointer w-[33px]" />
        </a>
        <a href="https://www.instagram.com/thoughtwin_solutions/">
          <CoinmarketcapIcon className="text-black cursor-pointer w-[29px]" />
        </a>
      </div>
    </div>
  );
};

export default FooterIcons;
