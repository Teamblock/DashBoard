import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { CurrencyLogo, CurrencyLogoArray } from "app/components/CurrencyLogo";
import QuestionHelper from "app/components/QuestionHelper";
import Typography from "app/components/Typography";
import {
  TABLE_TBODY_TD_CLASSNAME,
  TABLE_TBODY_TR_CLASSNAME,
} from "app/features/trident/constants";
import { classNames, formatNumber, formatPercent } from "app/functions";
import { useCurrency } from "app/hooks/Tokens";
import React, { FC, ReactNode } from "react";

import { PairType } from "./enum";

interface FarmListItem {
  farm: any;
  onClick(x: ReactNode): void;
  farmListCss?: string;
}
//{farm?.pair?.token1?.symbol}
// @ts-ignore TYPE NEEDS FIXING
{
  /* <Typography weight={700} className="text-white ml-16">
{formatNumber(farm.tvl, true)}
</Typography> */
}
const FarmListItem: FC<FarmListItem> = ({ farm, onClick, farmListCss }) => {
  console.log("cssss", farmListCss);
  const { i18n } = useLingui();
  const token0 = useCurrency(farm.pair.token0.id) ?? undefined;
  const token1 = useCurrency(farm.pair.token1.id) ?? undefined;

  return (
    <>
      {" "}
      <div
        className={classNames("grid  grid-cols-4 cursor-pointer", farmListCss)}
        onClick={onClick}
      >
        <div
          className={classNames("flex gap-2", TABLE_TBODY_TD_CLASSNAME(0, 4))}
        >
          {token0 && token1 && (
            <CurrencyLogoArray currencies={[token0, token1]} dense size={32} />
          )}
          <div className="flex flex-col items-start">
            <Typography weight={700} className="flex gap-1 text-high-emphesis">
              <span
                className={
                  farmListCss == "bg-[#474747] rounded"
                    ? "text-white"
                    : "text-black"
                }
              >
                {farm?.pair?.token1?.symbol}
              </span>
              <span
                className={
                  farmListCss == "bg-[#474747] rounded"
                    ? "text-white"
                    : "text-black"
                }
              >
                /
              </span>
              <span
                className={
                  farmListCss == "bg-[#474747] rounded"
                    ? "text-white"
                    : "text-black"
                }
              >
                {farm?.pair?.token1?.symbol}
              </span>
            </Typography>
            {farm?.pair?.type === PairType.SWAP && (
              <Typography variant="xs" className="text-low-emphesis">
                <span
                  className={
                    farmListCss == "bg-[#474747] rounded"
                      ? "text-white"
                      : "text-black"
                  }
                >
                  {i18n._(t`EnergyfiSwap Farm`)}
                </span>
              </Typography>
            )}
            {farm?.pair?.type === PairType.KASHI && (
              <Typography variant="xs" className="text-low-emphesis">
                {i18n._(t`Kashi Farm`)}
              </Typography>
            )}
          </div>
        </div>
        <div className={TABLE_TBODY_TD_CLASSNAME(1, 4)}>
          <Typography
            weight={700}
            className={
              farmListCss == "bg-[#474747] rounded"
                ? "text-white"
                : "text-black"
            }
          >
            {" "}
            {formatNumber(farm.tvl, true)}
          </Typography>
        </div>
        <div
          className={classNames(
            "flex flex-col maxLg:mr-12 !items-end !justify-center mr-16",
            TABLE_TBODY_TD_CLASSNAME(2, 4)
          )}
        >
          {/* @ts-ignore TYPE NEEDS FIXING */}
          {farm?.rewards?.map((reward, i) => (
            <Typography
              variant="sm"
              weight={700}
              key={i}
              className="flex gap-1.5 text-white justify-center items-center"
              component="span"
            >
              <span
                className={
                  farmListCss == "bg-[#474747] rounded"
                    ? "text-white"
                    : "text-black"
                }
              >
                {formatNumber(reward.rewardPerDay)}{" "}
              </span>
              <CurrencyLogo
                className="text-white"
                currency={reward.currency}
                size={16}
              />
            </Typography>
          ))}
        </div>
        <div
          className={classNames(
            "flex flex-col !items-end",
            TABLE_TBODY_TD_CLASSNAME(3, 4)
          )}
        >
          <Typography
            weight={700}
            className={
              farmListCss == "bg-[#474747] rounded"
                ? "flex gap-0.5 items-center text-white"
                : "flex gap-0.5 items-center text-black"
            }
          >
            {farm?.tvl !== 0
              ? farm?.roiPerYear > 10000
                ? ">10,000%"
                : formatPercent(farm?.roiPerYear * 100)
              : "Infinite"}
            {!!farm?.feeApyPerYear && (
              <QuestionHelper
                text={
                  <div className="flex flex-col">
                    <div>
                      Reward APR:{" "}
                      {farm?.tvl !== 0
                        ? farm?.rewardAprPerYear > 10000
                          ? ">10,000%"
                          : formatPercent(farm?.rewardAprPerYear * 100)
                        : "Infinite"}
                    </div>
                    <div>
                      Fee APR:{" "}
                      {farm?.feeApyPerYear < 10000
                        ? formatPercent(farm?.feeApyPerYear * 100)
                        : ">10,000%"}
                    </div>
                  </div>
                }
              />
            )}
          </Typography>
          {farmListCss == "bg-[#474747] rounded" ? (
            <Typography variant="xs" className="text-white">
              {" "}
              {i18n._(t`annualized`)} 1
            </Typography>
          ) : (
            <Typography variant="xs" className="text-black">
              {i18n._(t`annualized`)}1{" "}
            </Typography>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmListItem;
