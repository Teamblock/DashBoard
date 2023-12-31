import React, { FC, useEffect, useMemo, useState } from "react";
import Slider from "react-slick";

import Button from "../../../components/Button";
import Card from "../../../components/Card";
import {
  ClockIcon,
  ELogoIcon,
  LeftArrowIcon,
  LiveIcon,
  LockIcon,
  SuccessIcon,
  UserIcon,
} from "../../../components/Icon";
import { CurrencyLogo } from "../../../components/CurrencyLogo";
import Container from "../../../components/Container";
import Typography from "../../../components/Typography";
import { useActiveWeb3React } from "../../../services/web3";
import ChartCard from "../../../features/analytics/ChartCard";
import {
  useDayData,
  useFactory,
  useOneDayBlock,
  useOneWeekBlock,
  useSushiPairs,
  useTwoDayBlock,
  useTwoWeekBlock,
} from "../../../services/graph";
import useFarmRewards from "../../../hooks/useFarmRewards";
import ColoredNumber from "../../../features/analytics/ColoredNumber";
import {
  aprToApy,
  formatNumber,
  formatNumberScale,
  formatPercent,
} from "../../../functions";
import DoubleCurrencyLogo from "../../../components/DoubleLogo";
import { useCurrency } from "../../../hooks/Tokens";
import useTokensAnalytics from "../../../features/analytics/hooks/useTokensAnalytics";
import { getIlo } from "../../../api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/macro";
import router from "next/router";
import { CancelIcon } from "../../../components/Icon";
import LineGraph from "../../../components/LineGraph";
import Link from "next/link";
//@ts-ignore
import BannerImg from "../../../../public/images/BannerImg.png";
import CardImg from "../../../../public/images/cardimg.png";
import ElogoIcon from "../../../../public/images/Elogo.svg";
import UsdIcon from "../../../../public/images/usdt.jpg";
//@ts-ignore
import downArrow from "../../../../public/images/downArrow.svg";

const chartTimespans = [
  {
    text: "1W",
    length: 604800,
  },
  {
    text: "1M",
    length: 2629746,
  },
  {
    text: "1Y",
    length: 31556952,
  },
  {
    text: "ALL",
    length: Infinity,
  },
];

interface DashboardProps {}

interface FarmListProps {
  pools: {
    pair: FarmListNameProps;
    rewards: Reward[];
    liquidity: number;
    apr: number;
  }[];
}

type FarmListNameProps = {
  pair: {
    token0: {
      id: string;
    };
    token1: {
      id: string;
    };
    name: string;
    type: "Energyfi Farm" | "Kashi Farm";
  };
};

type Reward = {
  icon: string;
  currency: {
    symbol: string;
  };
  rewardPerDay: number;
};

interface PairListNameProps {
  pair: {
    token0: {
      id: string;
      symbol: string;
    };
    token1: {
      id: string;
      symbol: string;
    };
  };
}

interface Token {
  token: {
    id: string;
    symbol: string;
  };
  liquidity: number;
  volume1d: number;
  volume1w: number;
  price: number;
  change1d: number;
  change1w: number;
}

type TokenListColumnType =
  | "name"
  | "price"
  | "liquidity"
  | "priceChange"
  | "volumeChange"
  | "lastWeekGraph";
interface TokenListProps {
  tokens: Token[];
  enabledColumns?: TokenListColumnType[];
}
interface PairsListProps {
  link?: {
    href: string;
    id: string;
  };
}

interface TokenListNameProps {
  token: {
    id: string;
    symbol: string;
  };
}

type IsButton = "upcoming" | "live" | "success" | "failed";

const Dashboard: FC<DashboardProps> = ({}) => {
  const { i18n } = useLingui();
  const { account } = useActiveWeb3React();
  const [ilosList, setIlosList] = useState([]);
  const [filteredIlosList, setFilteredIlosList] = useState([]);
  console.log("🚀 ~ file: index.tsx:163 ~ filteredIlosList:", filteredIlosList);
  const [color, setColor] = useState<IsButton>("upcoming");

  const getColor = (type: IsButton) => {
    if (color === type) return "btnSecondary";
    return "transparent";
  };
  const TextColor = (type: IsButton) => {
    if (color === type) return "text-white border-Green";
    return "text-[#808080] border-Gray";
  };
  const IconColor = (type: IsButton) => {
    console.log(">>>>>>>>>", type);
    if (color === type) return "white";
    return "gray";
    return "green";
  };

  const { chainId } = useActiveWeb3React();

  const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId });
  const block2d = useTwoDayBlock({ chainId, shouldFetch: !!chainId });
  const block1w = useOneWeekBlock({ chainId, shouldFetch: !!chainId });

  const exchange = useFactory({ chainId });
  const exchange1d = useFactory({ chainId, variables: { block: block1d } });
  const exchange2d = useFactory({ chainId, variables: { block: block2d } });

  const dayData = useDayData({ chainId });

  const chartData = useMemo(
    () => ({
      liquidity: exchange?.liquidityUSD,
      liquidityChange:
        (exchange1d?.liquidityUSD / exchange2d?.liquidityUSD) * 100 - 100,
      liquidityChart: dayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({
          x: new Date(day.date * 1000),
          y: Number(day.liquidityUSD),
        })),

      volume1d: exchange?.volumeUSD - exchange1d?.volumeUSD,
      volume1dChange:
        ((exchange?.volumeUSD - exchange1d?.volumeUSD) /
          (exchange1d?.volumeUSD - exchange2d?.volumeUSD)) *
          100 -
        100,
      volumeChart: dayData
        // @ts-ignore TYPE NEEDS FIXING
        ?.sort((a, b) => a.date - b.date)
        // @ts-ignore TYPE NEEDS FIXING
        .map((day) => ({
          x: new Date(day.date * 1000),
          y: Number(day.volumeUSD),
        })),
    }),
    [exchange, exchange1d, exchange2d, dayData]
  );
  useEffect(() => {
    getLaunchPad();
  }, []);

  useEffect(() => {
    if (color) filterTabData(color);
  }, [color]);

  const getApy = (volume: number, liquidity: number) => {
    const apy = aprToApy(
      (((volume / 7) * 365 * 0.0025) / liquidity) * 100,
      3650
    );
    if (apy > 1000) return ">10,000%";
    return formatPercent(apy);
  };

  const getLaunchPad = async () => {
    const res: any = await getIlo();

    if (res?.data) {
      const data = res?.data?.ilos;
      setIlosList(data);
      const upcomingIlos = data.filter(
        (x: any) => x.status?.toLowerCase() === color
      );
      setFilteredIlosList(upcomingIlos);
    }
  };

  const filterTabData = (tab: string) => {
    let data: any = [];
    if (tab === "upcoming") {
      data = ilosList.filter(
        (x: any) => x.status?.toLowerCase() === "upcoming"
      );
    } else if (tab === "live") {
      data = ilosList.filter(
        ({ status }) =>
          status === "round1" || status === "round2" || status === "saleDone"
      );
    } else if (tab === "success") {
      data = ilosList.filter((x: any) => x.status?.toLowerCase() === "success");
    } else if (tab === "failed") {
      data = ilosList.filter((x: any) => x.status?.toLowerCase() === "failed");
    } else {
      data = [];
    }
    setFilteredIlosList(data);
  };

  const dayDifference = (startDate: string, endDate: string) => {
    const date1 = new Date(startDate).valueOf();
    const date2 = new Date(endDate).valueOf();
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  function PairListName({ pair }: PairListNameProps): JSX.Element {
    const token0 = useCurrency(pair?.token0?.id);
    const token1 = useCurrency(pair?.token1?.id);

    return (
      <>
        <div className="flex items-center">
          <DoubleCurrencyLogo
            className="-space-x-3"
            logoClassName="rounded-full"
            // @ts-ignore TYPE NEEDS FIXING
            currency0={token0}
            // @ts-ignore TYPE NEEDS FIXING
            currency1={token1}
            size={40}
          />
          <div className="flex flex-col ml-3 whitespace-nowrap">
            <div className="font-bold text-white">
              {pair?.token0?.symbol}-{pair?.token1?.symbol}
            </div>
          </div>
        </div>
      </>
    );
  }

  function TokenListName({ token }: TokenListNameProps): JSX.Element {
    const currency = useCurrency(token.id);
    return (
      <>
        <div className="flex items-center">
          {/*@ts-ignore TYPE NEEDS FIXING*/}
          <CurrencyLogo
            className="rounded-full"
            //@ts-ignore
            currency={currency}
            size={40}
          />
          <div className="ml-4 text-lg font-bold text-primary">
            {token.symbol}
          </div>
        </div>
      </>
    );
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const Hero: FC = () => {
    const handleScroll = () => {
      const element: any = document.getElementById("launchpad");
      const y = element.getBoundingClientRect().top - 100 + window.scrollY;
      window.scroll({
        top: y,
        behavior: "smooth",
      });
    };
    return (
      <>
         <div className="intro_section">
          <div className="container flex justify-center items-center">
            <div className="intro_left">
              <h1>Welcome to the Dex <br />Dashboard</h1>
              {/* <p className="mb-3">
                Discover NFTs by category, track the latest drops, and follow the
                collections you love. Enjoy it!
              </p> */}
              {/* <div className="intro_btn">
                <button
                  onClick={() => {
                    router.push(`/swap`);
                  }}
                  type="button"
                  className="buy_btn"
                >
                  Dashboard
                </button>
              </div> */}
            </div>

            {/* <div className="intro_right">
              <div className="intro_circle">
                <img src={BannerImg.src} alt="circle" />
              </div>
            </div> */}
          </div>
        </div>
      </>
    );
  };

  const Launchpad: FC = () => {
    return (
      <div id="launchpad" className="w-full h-full p-4 pt-7 Topheading">
        <Container maxWidth="6xl" className="mx-auto w-full h-full">
          <div className="">
            <Typography
              variant="h1"
              component="h1"
              className="!font-bold text-white text-xl"
            >
              Launchpad
            </Typography>
            <Typography className="text-white text-xs md:text-lg mt-2 max-w-[45%] maxLg:max-w-full">
              Cross-Chain and permissionless rugpull proof Launchpad
            </Typography>
          </div>
          <div className="flex justify-between maxLg:flex-wrap gap-4 mt-3 mb-3">
            <div className="md:flex md:gap-x-2.5  flex flex-wrap justify-between gap-y-2 maxSm:w-full">
              <Button
                fullWidth
                color={getColor("upcoming")}
                onClick={() => setColor("upcoming")}
                className={`!bg-[#eebd54] !font-normal text-black w-[47%]  md:w-[11rem] maxLg:text-sm maxLg:h-10 rounded-[0.350rem] border border-black h-14(
                  "upcoming"
                )}`}
                startIcon={
                  <ClockIcon
                    color={`${IconColor("upcoming")}`}
                    className={"w-6 h-6"}
                  />
                }
              >
                {i18n._(t`Upcoming`)}
              </Button>
              <Button
                fullWidth
                color={getColor("live")}
                onClick={() => setColor("live")}
                className={`text-white !font-normal w-[47%]  md:w-[11rem] maxLg:text-sm maxLg:h-10  border border-[#eebd54] rounded-[0.350rem] h-14
                                ${TextColor("live")}`}
                startIcon={
                  <LiveIcon
                    color={`${IconColor("live")}`}
                    className={"w-6 h-6"}
                  />
                }
              >
                {i18n._(t`Live`)}
              </Button>
              <Button
                fullWidth
                color={getColor("success")}
                onClick={() => setColor("success")}
                className={`text-white !font-normal  w-[47%]  md:w-[11rem] maxLg:text-sm maxLg:h-10 border border-[#eebd54]  rounded-[0.350rem] h-14
                                ${TextColor("success")}`}
                startIcon={
                  <SuccessIcon
                    color={`${IconColor("success")}`}
                    className={"w-6 h-6"}
                  />
                }
              >
                {i18n._(t`Success`)}
              </Button>
              <Button
                fullWidth
                color={getColor("failed")}
                onClick={() => setColor("failed")}
                className={`text-white !font-normal w-[47%]  md:w-[11rem] maxLg:text-sm maxLg:h-10 border border-[#eebd54] rounded-[0.350rem] h-14
                                ${TextColor("failed")}`}
                startIcon={
                  <CancelIcon
                    color={`${IconColor("failed")}`}
                    className={"w-6 h-6"}
                  />
                }
              >
                {i18n._(t`Failed`)}
              </Button>
            </div>
            <Button
              id="btn-create-new-pool"
              variant="filled"
              className="!text-black rounded-[0.350rem] !bg-[#eebd54] !font-bold h-14 w-[10rem] md:w-[11rem] maxLg:text-sm maxLg:h-10"
            >
              <a
                href="/launchpad/createIloGeneral"
                target="_blank"
                rel="noreferrer"
              >
                {i18n._(t`Create ILO`)}
              </a>
            </Button>
          </div>
          <div className="items-center gap-4 w-full my-1">
            <Slider {...settings} className="">
              <Card
                cardDesc="bg-[#1a202e] rounded-b-xl"
                className="w-full max-w-md border-gray-300 border-2"
                header={
                  <>
                    <Card.Header className="bg-[#fff] flex-col justify-center !py-2">
                      <Typography className="text-black font-normal text-sm uppercase">
                        ILO Successful
                      </Typography>
                    </Card.Header>
                  </>
                }
              >
                <div>
                  <img src={CardImg.src} alt="CardImg" />{" "}
                </div>
                <div className="p-2">
                  <div className="flex gap-6 items-center justify-between w-full">
                    <Typography className="text-white ilo_heading_Text !font-semibold maxMd:text-lg ">
                      Dex Token (DT)
                    </Typography>
                    <LeftArrowIcon className="flex justify-end" />
                  </div>
                  <div className="flex items-center justify-between my-10">
                    <Typography className="flex items-center text-white text-lg font-normal !font-semibold">
                      <LockIcon className="mr-2.5" />
                      30%
                    </Typography>
                    <Typography className="flex items-center text-white text-lg font-normal !font-semibold">
                      <UserIcon className="mr-2.5" />
                      585
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      fullWidth
                      color="Indigo"
                      className={`w-full text-sm md:text-base max-w-[8rem] font-normal rounded-full !bg-[#eebd54] text-black h-10 maxMd:h-8  maxMd:max-w-[6rem]`}
                    >
                      Successful
                    </Button>
                    <Typography className="flex items-end flex-col text-white md:text-lg font-normal">
                      Duration
                      <span className="!font-bold maxMd:text-[0.75rem]">
                        2 Days
                      </span>
                    </Typography>
                  </div>
                </div>
                <Typography className="bg-[#0c0e1b] text-white text-[0.65rem] md:text-base flex justify-center items-center w-full py-1 rounded-b-xl md:!font-medium">
                  1000.000/1000.000BNB
                </Typography>
              </Card>
              <Card
                cardDesc="bg-[#1a202e] rounded-b-xl"
                className="w-full max-w-md border-gray-300 border-2"
                header={
                  <>
                    <Card.Header className="bg-[#fff] flex-col justify-center !py-2">
                      <Typography className="text-black font-normal text-sm uppercase">
                        ILO Successful
                      </Typography>
                    </Card.Header>
                  </>
                }
              >
                <div>
                  <img src={CardImg.src} alt="CardImg" />{" "}
                </div>
                <div className="p-2">
                  <div className="flex gap-6 items-center justify-between w-full">
                    <Typography className="text-white ilo_heading_Text !font-semibold maxMd:text-lg ">
                      Dex Token (DT)
                    </Typography>
                    <LeftArrowIcon className="flex justify-end" />
                  </div>
                  <div className="flex items-center justify-between my-10">
                    <Typography className="flex items-center text-white text-lg font-normal !font-semibold">
                      <LockIcon className="mr-2.5" />
                      30%
                    </Typography>
                    <Typography className="flex items-center text-white text-lg font-normal !font-semibold">
                      <UserIcon className="mr-2.5" />
                      585
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      fullWidth
                      color="Indigo"
                      className={`w-full text-sm md:text-base max-w-[8rem] font-normal rounded-full !bg-[#eebd54] text-black h-10 maxMd:h-8  maxMd:max-w-[6rem]`}
                    >
                      Successful
                    </Button>
                    <Typography className="flex items-end flex-col text-white md:text-lg font-normal">
                      Duration
                      <span className="!font-bold maxMd:text-[0.75rem]">
                        2 Days
                      </span>
                    </Typography>
                  </div>
                </div>
                <Typography className="bg-[#0c0e1b] text-white text-[0.65rem] md:text-base flex justify-center items-center w-full py-1 rounded-b-xl md:!font-medium">
                  1000.000/1000.000BNB
                </Typography>
              </Card>
              <Card
                cardDesc="bg-[#1a202e] rounded-b-xl"
                className="w-full max-w-md border-gray-300 border-2"
                header={
                  <>
                    <Card.Header className="bg-[#fff] flex-col justify-center !py-2">
                      <Typography className="text-black font-normal text-sm uppercase">
                        ILO Successful
                      </Typography>
                    </Card.Header>
                  </>
                }
              >
                <div>
                  <img src={CardImg.src} alt="CardImg" />{" "}
                </div>
                <div className="p-2">
                  <div className="flex gap-6 items-center justify-between w-full">
                    <Typography className="text-white ilo_heading_Text !font-semibold maxMd:text-lg ">
                      Dex Token (DT)
                    </Typography>
                    <LeftArrowIcon className="flex justify-end" />
                  </div>
                  <div className="flex items-center justify-between my-10">
                    <Typography className="flex items-center text-white text-lg font-normal !font-semibold">
                      <LockIcon className="mr-2.5" />
                      30%
                    </Typography>
                    <Typography className="flex items-center text-white text-lg font-normal !font-semibold">
                      <UserIcon className="mr-2.5" />
                      585
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      fullWidth
                      color="Indigo"
                      className={`w-full text-sm md:text-base max-w-[8rem] font-normal rounded-full !bg-[#eebd54] text-black h-10 maxMd:h-8  maxMd:max-w-[6rem]`}
                    >
                      Successful
                    </Button>
                    <Typography className="flex items-end flex-col text-white md:text-lg font-normal">
                      Duration
                      <span className="!font-bold maxMd:text-[0.75rem]">
                        2 Days
                      </span>
                    </Typography>
                  </div>
                </div>
                <Typography className="bg-[#0c0e1b] text-white text-[0.65rem] md:text-base flex justify-center items-center w-full py-1 rounded-b-xl md:!font-medium">
                  1000.000/1000.000BNB
                </Typography>
              </Card>
              <Card
                cardDesc="bg-[#1a202e] rounded-b-xl"
                className="w-full max-w-md border-gray-300 border-2"
                header={
                  <>
                    <Card.Header className="bg-[#fff] flex-col justify-center !py-2">
                      <Typography className="text-black font-normal text-sm uppercase">
                        ILO Successful
                      </Typography>
                    </Card.Header>
                  </>
                }
              >
                <div>
                  <img src={CardImg.src} alt="CardImg" />{" "}
                </div>
                <div className="p-2">
                  <div className="flex gap-6 items-center justify-between w-full">
                    <Typography className="text-white ilo_heading_Text !font-semibold maxMd:text-lg ">
                      Dex Token (DT)
                    </Typography>
                    <LeftArrowIcon className="flex justify-end" />
                  </div>
                  <div className="flex items-center justify-between my-10">
                    <Typography className="flex items-center text-white text-lg font-normal !font-semibold">
                      <LockIcon className="mr-2.5" />
                      30%
                    </Typography>
                    <Typography className="flex items-center text-white text-lg font-normal !font-semibold">
                      <UserIcon className="mr-2.5" />
                      585
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      fullWidth
                      color="Indigo"
                      className={`w-full text-sm md:text-base max-w-[8rem] font-normal rounded-full !bg-[#eebd54] text-black h-10 maxMd:h-8  maxMd:max-w-[6rem]`}
                    >
                      Successful
                    </Button>
                    <Typography className="flex items-end flex-col text-white md:text-lg font-normal">
                      Duration
                      <span className="!font-bold maxMd:text-[0.75rem]">
                        2 Days
                      </span>
                    </Typography>
                  </div>
                </div>
                <Typography className="bg-[#0c0e1b] text-white text-[0.65rem] md:text-base flex justify-center items-center w-full py-1 rounded-b-xl md:!font-medium">
                  1000.000/1000.000BNB
                </Typography>
              </Card>
            </Slider>
          </div>
        </Container>
      </div>
    );
  };

  const EFTStats: FC = () => {
    return (
      <div className="w-full h-full px-4 pt-2 maxMd:pt-0 Topheading">
        <Container maxWidth="6xl" className="mx-auto w-full h-full">
          <div className="">
            <Typography
              variant="h1"
              component="h1"
              className="!font-bold maxLg:text-lg text-black mb-4 maxLg:mb-0"
            >
              EFT Stats
            </Typography>
            <div className="flex justify-between maxLg:flex-wrap gap-3">
              <Typography className="text-gray-700 text-xs md:text-lg mt-2 max-w-[50%] maxLg:max-w-full">
                A collection of the core learning resources for developers
                onboarding to Ecoswap
              </Typography>
              <Button
                variant="filled"
                className="text-base !text-white w-[10rem] md:w-[11rem] maxLg:text-sm maxLg:h-10 font-normal rounded-[0.350rem] h-14 !bg-black"
                onClick={() => {
                  router.push(`/analytics/xenergyfi`);
                }}
              >
                EFT Stats
              </Button>
            </div>
          </div>

          <div className="flex justify-between maxLg:flex-wrap gap-4 w-full mt-10 maxLg:mt-4">
            <Card
              cardDesc=" maxLg:p-0 rounded-[0.350rem] h-[20rem]"
              className="w-full max-w-full"
            >
              <div className="Cus-gradient">
                <ChartCard
                  header="TVL"
                  subheader="Energyfi AMM"
                  figure={chartData.liquidity}
                  change={chartData.liquidityChange}
                  chart={chartData.liquidityChart}
                  defaultTimespan="1W"
                  timespans={chartTimespans}
                />
              </div>
            </Card>
            <Card
              cardDesc="maxLg:p-0 rounded-[0.350rem] h-[20rem]"
              className="w-full max-w-full"
            >
              <div className="Cus-gradient">
                <ChartCard
                  header="Volume"
                  subheader="Energyfi AMM"
                  figure={chartData.volume1d}
                  change={chartData.volume1dChange}
                  chart={chartData.volumeChart}
                  defaultTimespan="1W"
                  timespans={chartTimespans}
                />
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  };

  const YieldFarming: FC<FarmListProps> = () => {
    const [index, setIndex] = useState(0);
    const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
    const farms = useFarmRewards();

    const farmsFormatted = useMemo(
      () =>
        farms
          ?.map((farm) => ({
            pair: {
              token0: farm.pair.token0,
              token1: farm.pair.token1,
              id: farm.pair.id,
              name:
                farm.pair.symbol ??
                `${farm.pair.token0.symbol}-${farm.pair.token1.symbol}`,
              type: farm.pair.symbol ? "Kashi Farm" : "Energyfi Farm",
            },
            rewards: farm.rewards,
            liquidity: farm.tvl,
            apr: {
              daily: farm.roiPerDay * 100,
              monthly: farm.roiPerMonth * 100,
              annual: farm.roiPerYear * 100,
            },
          }))
          .filter((farm) => (farm ? true : false)),
      [farms]
    );

    return (
      <div className="w-full h-full pt-5 px-4 maxMd:pt-0">
        <Container maxWidth="6xl" className="mx-auto w-full h-full Topheading">
          <div className="mt-1 md:mb-2">
            <Typography
              variant="h1"
              component="h1"
              className="!font-bold maxLg:text-lg text-black mb-4 maxLg:mb-0"
            >
              Yield Farming
            </Typography>
            <div className="flex maxLg:flex-wrap justify-between gap-3">
              <Typography className="text-gray-700 text-xs md:text-lg mt-2 max-w-[45%] maxLg:max-w-full">
                A collection of the core learning resources for developers
                onboarding to EFTswap
              </Typography>
              <Button
                variant="filled"
                className="!text-white w-[10rem] md:w-[11rem] maxLg:text-sm maxLg:h-10 font-normal rounded-[0.350rem] h-14 !bg-black"
                onClick={() => {
                  router.push(`/analytics/farms`);
                }}
              >
                Go to Farming
              </Button>
            </div>
          </div>

          <div className="items-center">
            <div className="items-center gap-4">
              <Slider {...settings} className="">
                <Card
                  cardDesc="bg-trabsparent border !border-Gray p-4 w-full rounded-xl"
                  className="w-full max-w-md cursor-pointer"
                >
                  <div className="flex gap-2 items-center cursor-pointer text-primary font-bold">
                    <img
                      src={ElogoIcon.src}
                      alt="circle"
                      className="w-10 border-2 border-gray-500 rounded-full"
                    />
                    <img
                      src={UsdIcon.src}
                      alt="circle"
                      className="w-10 border-2 border-gray-500 rounded-full"
                    />
                    USDT/GLMR
                  </div>
                  <div className="flex pt-4 justify-between">
                    <Typography className="text-black">
                      APR
                      <div className="items-center text-md mt-2 !font-semibold text-black">
                        383.9%
                      </div>
                    </Typography>
                    <Typography>
                      <div className="flex text-sm flex-col">
                        <div className="text-black">TVL</div>
                        <div className="items-center mt-2 !font-semibold text-black">
                          $53.76
                        </div>
                      </div>
                    </Typography>
                    <Typography>
                      <div className="flex text-sm flex-col">
                        <div className="text-black">Your Stake</div>
                        <div className="items-center mt-2 !font-semibold text-black">
                          $0
                        </div>
                      </div>
                    </Typography>
                  </div>
                </Card>
                <Card
                  cardDesc="bg-trabsparent border !border-Gray p-4 w-full rounded-xl"
                  className="w-full max-w-md cursor-pointer"
                >
                  <div className="flex gap-2 items-center cursor-pointer text-primary font-bold">
                    <img
                      src={ElogoIcon.src}
                      alt="circle"
                      className="w-10 border-2 border-gray-500 rounded-full"
                    />
                    <img
                      src={UsdIcon.src}
                      alt="circle"
                      className="w-10 border-2 border-gray-500 rounded-full"
                    />
                    USDT/GLMR
                  </div>
                  <div className="flex pt-4 justify-between">
                    <Typography className="text-black">
                      APR
                      <div className="items-center text-md mt-2 !font-semibold text-black">
                        383.9%
                      </div>
                    </Typography>
                    <Typography>
                      <div className="flex text-sm flex-col">
                        <div className="text-black">TVL</div>
                        <div className="items-center mt-2 !font-semibold text-black">
                          $53.76
                        </div>
                      </div>
                    </Typography>
                    <Typography>
                      <div className="flex text-sm flex-col">
                        <div className="text-black">Your Stake</div>
                        <div className="items-center mt-2 !font-semibold text-black">
                          $0
                        </div>
                      </div>
                    </Typography>
                  </div>
                </Card>
                <Card
                  cardDesc="bg-trabsparent border !border-Gray p-4 w-full rounded-xl"
                  className="w-full max-w-md cursor-pointer"
                >
                  <div className="flex gap-2 items-center cursor-pointer text-primary font-bold">
                    <img
                      src={ElogoIcon.src}
                      alt="circle"
                      className="w-10 border-2 border-gray-500 rounded-full"
                    />
                    <img
                      src={UsdIcon.src}
                      alt="circle"
                      className="w-10 border-2 border-gray-500 rounded-full"
                    />
                    USDT/GLMR
                  </div>
                  <div className="flex pt-4 justify-between">
                    <Typography className="text-black">
                      APR
                      <div className="items-center text-md mt-2 !font-semibold text-black">
                        383.9%
                      </div>
                    </Typography>
                    <Typography>
                      <div className="flex text-sm flex-col">
                        <div className="text-black">TVL</div>
                        <div className="items-center mt-2 !font-semibold text-black">
                          $53.76
                        </div>
                      </div>
                    </Typography>
                    <Typography>
                      <div className="flex text-sm flex-col">
                        <div className="text-black">Your Stake</div>
                        <div className="items-center mt-2 !font-semibold text-black">
                          $0
                        </div>
                      </div>
                    </Typography>
                  </div>
                </Card>
                <Card
                  cardDesc="bg-trabsparent border !border-Gray p-4 w-full rounded-xl"
                  className="w-full max-w-md cursor-pointer"
                >
                  <div className="flex gap-2 items-center cursor-pointer text-primary font-bold">
                    <img
                      src={ElogoIcon.src}
                      alt="circle"
                      className="w-10 border-2 border-gray-500 rounded-full"
                    />
                    <img
                      src={UsdIcon.src}
                      alt="circle"
                      className="w-10 border-2 border-gray-500 rounded-full"
                    />
                    USDT/GLMR
                  </div>
                  <div className="flex pt-4 justify-between">
                    <Typography className="text-black">
                      APR
                      <div className="items-center text-md mt-2 !font-semibold text-black">
                        383.9%
                      </div>
                    </Typography>
                    <Typography>
                      <div className="flex text-sm flex-col">
                        <div className="text-black">TVL</div>
                        <div className="items-center mt-2 !font-semibold text-black">
                          $53.76
                        </div>
                      </div>
                    </Typography>
                    <Typography>
                      <div className="flex text-sm flex-col">
                        <div className="text-black">Your Stake</div>
                        <div className="items-center mt-2 !font-semibold text-black">
                          $0
                        </div>
                      </div>
                    </Typography>
                  </div>
                </Card>
              </Slider>
            </div>
          </div>
        </Container>
      </div>
    );
  };

  const Pairs: FC<PairsListProps> = ({ link }) => {
    const [type, setType] = useState<"all" | "gainers" | "losers">("all");
    const { chainId } = useActiveWeb3React();
    const block1d = useOneDayBlock({ chainId, shouldFetch: !!chainId });
    const block2d = useTwoDayBlock({ chainId, shouldFetch: !!chainId });
    const block1w = useOneWeekBlock({ chainId, shouldFetch: !!chainId });
    const block2w = useTwoWeekBlock({ chainId, shouldFetch: !!chainId });

    const pairs = useSushiPairs({ chainId });
    const pairs1d = useSushiPairs({
      variables: { block: block1d },
      shouldFetch: !!block1d,
      chainId,
    });
    const pairs2d = useSushiPairs({
      variables: { block: block2d },
      shouldFetch: !!block2d && type !== "all",
      chainId,
    }); // No need to fetch if we don't need the data
    const pairs1w = useSushiPairs({
      variables: { block: block1w },
      shouldFetch: !!block1w,
      chainId,
    });
    const pairs2w = useSushiPairs({
      variables: { block: block2w },
      shouldFetch: !!block2w && type !== "all",
      chainId,
    });
    const pairsFormatted = useMemo(() => {
      return type === "all"
        ? // @ts-ignore TYPE NEEDS FIXING
          pairs?.slice(0, 9)?.map((pair) => {
            // @ts-ignore TYPE NEEDS FIXING
            const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair;
            // @ts-ignore TYPE NEEDS FIXING
            const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair1d;

            return {
              pair: {
                token0: pair.token0,
                token1: pair.token1,
                id: pair.id,
              },
              liquidity: pair.reserveUSD,
              volume1d: pair.volumeUSD - pair1d.volumeUSD,
              volume1w: pair.volumeUSD - pair1w.volumeUSD,
            };
          })
        : pairs
            // @ts-ignore TYPE NEEDS FIXING
            ?.map((pair) => {
              // @ts-ignore TYPE NEEDS FIXING
              const pair1d = pairs1d?.find((p) => pair.id === p.id) ?? pair;
              // @ts-ignore TYPE NEEDS FIXING
              const pair2d = pairs2d?.find((p) => pair.id === p.id) ?? pair1d;
              // @ts-ignore TYPE NEEDS FIXING
              const pair1w = pairs1w?.find((p) => pair.id === p.id) ?? pair2d;
              // @ts-ignore TYPE NEEDS FIXING
              const pair2w = pairs2w?.find((p) => pair.id === p.id) ?? pair1w;

              return {
                pair: {
                  token0: pair.token0,
                  token1: pair.token1,
                  id: pair.id,
                },
                liquidityChangeNumber1d: pair.reserveUSD - pair1d.reserveUSD,
                liquidityChangePercent1d:
                  (pair.reserveUSD / pair1d.reserveUSD) * 100 - 100,
                liquidityChangeNumber1w: pair.reserveUSD - pair1w.reserveUSD,
                liquidityChangePercent1w:
                  (pair.reserveUSD / pair1w.reserveUSD) * 100 - 100,

                volumeChangeNumber1d:
                  pair.volumeUSD -
                  pair1d.volumeUSD -
                  (pair1d.volumeUSD - pair2d.volumeUSD),
                volumeChangePercent1d:
                  ((pair.volumeUSD - pair1d.volumeUSD) /
                    (pair1d.volumeUSD - pair2d.volumeUSD)) *
                    100 -
                  100,
                volumeChangeNumber1w:
                  pair.volumeUSD -
                  pair1w.volumeUSD -
                  (pair1w.volumeUSD - pair2w.volumeUSD),
                volumeChangePercent1w:
                  ((pair.volumeUSD - pair1w.volumeUSD) /
                    (pair1w.volumeUSD - pair2w.volumeUSD)) *
                    100 -
                  100,
              };
            })
            // @ts-ignore TYPE NEEDS FIXING
            .sort(
              (a, b) => b.liquidityChangeNumber1d - a.liquidityChangeNumber1d
            );
    }, [type, pairs, pairs1d, pairs2d, pairs1w, pairs2w]);

    return (
      <div className="w-full h-full p-4 maxMd:pt-0">
        <Container maxWidth="6xl" className="mx-auto w-full h-full Topheading">
          <div className="mt-7">
            <Typography
              variant="h1"
              component="h1"
              className="!font-bold maxLg:text-lg text-black mb-4 maxLg:mb-0"
            >
              Pairs
            </Typography>
            <div className="flex maxLg:flex-wrap justify-between gap-3">
              <Typography className="text-gray-700 text-xs md:text-lg mt-2 max-w-[35%] maxLg:max-w-full">
                Click on the column name to sort pairs by its TVL, volume or
                fees gained.
              </Typography>
              <Button
                variant="filled"
                className="!text-white w-[10rem] md:w-[11rem] maxLg:text-sm maxLg:h-10 font-normal rounded-[0.350rem] h-14 !bg-black"
                onClick={() => {
                  router.push(`/analytics/pairs`);
                }}
              >
                All Pairs
              </Button>
            </div>
          </div>

          <div className="items-center gap-4 w-full my-1">
            <Slider {...settings} className="">
              {pairsFormatted?.slice(0, 9)?.map((items: any, index: any) => {
                return (
                  <Card
                    cardDesc="bg-trabsparent border !border-Gray p-4 rounded-xl"
                    className="w-full max-w-md cursor-pointer"
                  >
                    <div
                      key={index}
                      onClick={
                        items?.pair.id
                          ? () => {
                              router.push(`/analytics/pairs/${items?.pair.id}`);
                            }
                          : () => {}
                      }
                      className="cursor-pointer"
                    >
                      <div className="flex gap-6 items-center">
                        <PairListName pair={items?.pair} />
                      </div>
                      <div className="flex text-Gray text-sm justify-between my-4">
                        <Typography className="flex items-center text-lg font-normal !font-semibold">
                          <div className="flex flex-col text-sm">
                            <div className="text-[#333333]"> TVL</div>
                            <div className="text-[#1C1C1C]">
                              {formatNumberScale(items.liquidity, true)}
                            </div>
                          </div>
                        </Typography>
                        <Typography className="flex items-center text-lg font-normal !font-semibold">
                          <div className="flex flex-col text-sm">
                            <div className="text-[#333333]"> Annual APY</div>
                            <div className="text-[#1C1C1C] pt-1 text-right text-sm">
                              {getApy(items.volume1w, items.liquidity)}
                            </div>
                          </div>
                        </Typography>
                      </div>
                      <div className="flex text-Gray text-sm justify-between">
                        <Typography className="flex items-center text-lg font-normal !font-semibold">
                          <div className="flex flex-col text-sm gap-1">
                            <div className="text-[#333333] text-sm font-normal">
                              Daily / Weekly Volume
                            </div>
                            <div>
                              <div className="font-medium text-[#1C1C1C] font-semibold">
                                {formatNumber(items.volume1d, true, false, 2)}
                              </div>
                              <div className="font-normal text-[#1C1C1C] font-semibold">
                                {formatNumber(items.volume1w, true, false, 2)}
                              </div>
                            </div>
                          </div>
                        </Typography>
                        <Typography className="flex items-center text-lg font-normal !font-semibold">
                          <div className="flex flex-col text-sm gap-1">
                            <div className="text-[#333333] font-normal">
                              Daily / Weekly Fees
                            </div>
                            <div>
                              <div className="font-medium text-right text-[#1C1C1C] text-sm font-semibold">
                                {formatNumber(
                                  items.volume1d * 0.003,
                                  true,
                                  false,
                                  2
                                )}
                              </div>
                              <div className="font-normal text-right text-[#1C1C1C] font-semibold">
                                {formatNumber(
                                  items.volume1w * 0.003,
                                  true,
                                  false,
                                  2
                                )}
                              </div>
                            </div>
                          </div>
                        </Typography>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </Slider>
          </div>
        </Container>
      </div>
    );
  };

  const Tokens: FC<TokenListProps> = () => {
    const tokensList = useTokensAnalytics();

    const skipToken = [
      "0x204b3a633c855e9b545f65d00b104ca08a95b522",
      "0x741fa4552a8d38ba504729d8c178bdc35454c8f8",
      "0xeb813611a8b5e2f8559f1a156c20904426de1147",
      "0xcdb5654aa16bf7b19c75145497714eb9557d3a60",
      "0xc01ea20752b35f2105d07ee3eed580a117caabd4",
      "0xa18546d369cb066fd3fdae8f26a77ad26c32a5e4",
    ];

    const tokens = tokensList?.filter((item) => {
      const findRes = skipToken.filter((el) => el === item.token.id).length;
      if (!findRes) {
        return item;
      }
    });

    return (
      <div className="w-full h-full p-4 maxMd:pt-0">
        <Container maxWidth="6xl" className="mx-auto w-full h-full Topheading">
          <div className="mt-3">
            <Typography
              variant="h1"
              component="h1"
              className="!font-bold maxLg:text-lg text-black mb-4 maxLg:mb-0"
            >
              Tokens
            </Typography>
            <div className="flex maxLg:flex-wrap flex justify-between gap-3">
              <Typography className="text-gray-700 text-xs md:text-lg mt-2 max-w-[40%] maxLg:max-w-full">
                Click on the column name to sort tokens by it's price or trading
                volume.
              </Typography>
              <Button
                variant="filled"
                className="!text-white w-[10rem] md:w-[11rem] maxLg:text-sm maxLg:h-10 font-normal rounded-[0.350rem] h-14 !bg-black"
                onClick={() => {
                  router.push(`/analytics/tokens`);
                }}
              >
                All Tokens
              </Button>
            </div>
          </div>
          <div className="gap-4 items-center w-full ">
            <Slider {...settings} className="">
              {tokens?.slice(0, 9)?.map((items: any, index: any) => {
                return (
                  <Card
                    key={index}
                    cardDesc="bg-trabsparent border !border-Gray p-4 rounded-xl"
                    className="w-full max-w-md cursor-pointer"
                  >
                    <div
                      onClick={
                        items?.token.id
                          ? () => {
                              router.push(
                                `/analytics/tokens/${items?.token.id}`
                              );
                            }
                          : () => {}
                      }
                      className="cursor-pointer"
                    >
                      <div className="flex gap-6 items-center">
                        <TokenListName token={items.token} />
                      </div>
                      <div className="flex text-Gray text-sm justify-between my-4">
                        <Typography className="flex items-center text-lg !font-semibold">
                          <div className="flex flex-col text-sm">
                            <div className="text-[#333333]"> Price</div>
                            <div className="text-[#1C1C1C] text-right pt-1 text-sm">
                              {formatNumber(items.price, true, undefined, 2)}
                            </div>
                          </div>
                        </Typography>
                        <Typography className="flex items-center text-lg !font-semibold">
                          <div className="flex flex-col text-sm">
                            <div className="text-[#333333]">Liquidity</div>
                            <div className="text-[#1C1C1C] pt-1 text-right text-sm">
                              {formatNumber(items.liquidity, true, false)}
                            </div>
                          </div>
                        </Typography>
                      </div>
                      <div className="flex text-Gray text-sm justify-between">
                        <Typography className="flex items-center text-lg !font-semibold">
                          <div className="flex flex-col text-sm ">
                            <div className="text-[#333333]">Daily/weekly</div>
                            <div className="text-[#333333]">% Change</div>
                            <div>
                              <ColoredNumber
                                className="font-medium"
                                number={items?.change1d}
                                percent={true}
                              />
                              <div className="font-normal text-[#1C1C1C]">
                                {items?.change1w > 0 && "+"}
                                {formatPercent(items?.change1w)}
                              </div>
                            </div>
                          </div>
                        </Typography>
                        <Typography className="flex items-center text-lg !font-semibold">
                          <div className="flex flex-col text-sm ">
                            <div className="text-[#333333]">Daily/weekly</div>
                            <div className="text-right text-[#333333]">
                              Volume
                            </div>
                            <div>
                              <div className="font-medium text-right text-[#1C1C1C]">
                                {formatNumber(items?.volume1d, true, false, 2)}
                              </div>
                              <div className="font-normal text-right text-[#1C1C1C]">
                                {formatNumber(items?.volume1w, true, false, 2)}
                              </div>
                            </div>
                          </div>
                        </Typography>
                      </div>
                      <div className="pt-4 items-center text-Gray text-sm text-[#333333] w-full">
                        Last Week
                        <div className="flex w-full h-full py-2">
                          <div className="w-full h-20">
                            <LineGraph
                              data={items.graph}
                              stroke={{
                                solid:
                                  items?.change1w > 0 ? "#0FB871" : "#A466FF",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </Slider>
          </div>
        </Container>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <div>
        <Hero />
      </div>
      <div>
        <Launchpad />
        <EFTStats />
        <YieldFarming pools={[]} />
        <Pairs />
        <Tokens tokens={[]} />
      </div>
    </div>
  );
};

export default Dashboard;
