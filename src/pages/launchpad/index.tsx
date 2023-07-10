import { t } from "@lingui/macro";
import React, { FC, useEffect, useMemo, useState } from "react";
import Container from "../../components/Container";
import {
  CancelIcon,
  ClockIcon,
  LeftArrowIcon,
  LiveIcon,
  LockIcon,
  SuccessIcon,
  UserIcon,
} from "../../components/Icon";
import Typography from "../../components/Typography";
import Slider from "react-slick";
// import CardImg from "../../../../public/images/cardimg.png";
import CardImg from "../../../public/images/cardimg.png";

import { i18n } from "@lingui/core";
import Card from "../../components/Card";
import Button from "../../components/Button";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Launchpad: FC = () => {
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
  type IsButton = "upcoming" | "live" | "success" | "failed";
  const [color, setColor] = useState<IsButton>("upcoming");
  const getColor = (type: IsButton) => {
    if (color === type) return "btnSecondary";
    return "transparent";
  };
  const IconColor = (type: IsButton) => {
    console.log(">>>>>>>>>", type);
    if (color === type) return "white";
    return "gray";
    return "green";
  };
  const TextColor = (type: IsButton) => {
    if (color === type) return "";
    return "text-[#808080] border-Gray";
  };
  return (
    <div
      id="launchpad"
      className="w-full h-full p-4 pt-0 Topheading intro_section maxMd:!h-full"
    >
      <Container maxWidth="6xl" className="mx-auto w-full h-full">
        <div className="">
          <Typography
            variant="h1"
            component="h1"
            className="!font-bold text-black text-xl"
          >
            Launchpad 123
          </Typography>
          <Typography className="text-gray-700 text-xs md:text-lg mt-2 max-w-[45%] maxLg:max-w-full">
            Cross-Chain and permissionless rugpull proof Launchpad
          </Typography>
        </div>
        <div className="flex justify-between maxLg:flex-wrap gap-4 mt-3">
          <div className="md:flex md:gap-x-2.5  flex flex-wrap justify-between gap-y-2 maxSm:w-full">
            <Button
              fullWidth
              color={getColor("upcoming")}
              onClick={() => setColor("upcoming")}
              className={`text-base bg-black text-white w-[47%]  md:w-[11rem] maxLg:text-sm maxLg:h-10 font-semibold rounded-[0.350rem] border border-black h-14 ${TextColor(
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
              className={`text-black !font-normal w-[47%]  md:w-[11rem] maxLg:text-sm maxLg:h-10 font-semibold border border-Gray rounded-[0.350rem] h-14
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
              className={`text-black !font-normal  w-[47%]  md:w-[11rem] maxLg:text-sm maxLg:h-10 font-semibold border border-Gray rounded-[0.350rem] h-14
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
              className={`text-black !font-normal w-[47%]  md:w-[11rem] maxLg:text-sm maxLg:h-10 font-semibold border border-Gray rounded-[0.350rem] h-14
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
            className="!text-white !font-medium rounded-[0.350rem] !bg-black h-14 w-[10rem] md:w-[11rem] maxLg:text-sm maxLg:h-10 font-normal"
          >
            <a
              href="https://thoughtwin-launchpad.netlify.app/launchpad/createIloGeneral"
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
              cardDesc="bg-g-card1 rounded-b-xl"
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
                  <Typography className="text-black ilo_heading_Text !font-semibold maxMd:text-lg ">
                    Dex Token (DT)
                  </Typography>
                  <LeftArrowIcon className="flex justify-end" />
                </div>
                <div className="flex items-center justify-between my-10">
                  <Typography className="flex items-center text-black text-lg font-normal !font-semibold">
                    <LockIcon className="mr-2.5" />
                    30%
                  </Typography>
                  <Typography className="flex items-center text-black text-lg font-normal !font-semibold">
                    <UserIcon className="mr-2.5" />
                    585
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    fullWidth
                    color="Indigo"
                    className={`w-full text-sm md:text-base max-w-[8rem] font-normal rounded-full !bg-black text-white h-10 maxMd:h-8  maxMd:max-w-[6rem]`}
                  >
                    Successful
                  </Button>
                  <Typography className="flex items-end flex-col text-black md:text-lg font-normal">
                    Duration
                    <span className="!font-bold maxMd:text-[0.75rem]">
                      2 Days
                    </span>
                  </Typography>
                </div>
              </div>
              <Typography className="bg-black text-white text-[0.65rem] md:text-base flex justify-center items-center w-full py-1 rounded-b-xl md:!font-medium">
                1000.000/1000.000BNB
              </Typography>
            </Card>
            <Card
              cardDesc="bg-g-card1 rounded-b-xl"
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
                  <Typography className="text-black ilo_heading_Text !font-semibold maxMd:text-lg ">
                    Dex Token (DT)
                  </Typography>
                  <LeftArrowIcon className="flex justify-end" />
                </div>
                <div className="flex items-center justify-between my-10">
                  <Typography className="flex items-center text-black text-lg font-normal !font-semibold">
                    <LockIcon className="mr-2.5" />
                    30%
                  </Typography>
                  <Typography className="flex items-center text-black text-lg font-normal !font-semibold">
                    <UserIcon className="mr-2.5" />
                    585
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    fullWidth
                    color="Indigo"
                    className={`w-full text-sm md:text-base max-w-[8rem] font-normal rounded-full !bg-primary text-white h-10 maxMd:h-8  maxMd:max-w-[6rem]`}
                  >
                    Successful
                  </Button>
                  <Typography className="flex items-end flex-col text-black md:text-lg font-normal">
                    Duration
                    <span className="!font-bold maxMd:text-[0.75rem]">
                      2 Days
                    </span>
                  </Typography>
                </div>
              </div>
              <Typography className="bg-black text-white text-[0.65rem] md:text-base flex justify-center items-center w-full py-1 rounded-b-xl md:!font-medium">
                1000.000/1000.000BNB
              </Typography>
            </Card>
            <Card
              cardDesc="bg-g-card1 rounded-b-xl"
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
                  <Typography className="text-black ilo_heading_Text !font-semibold maxMd:text-lg ">
                    Dex Token (DT)
                  </Typography>
                  <LeftArrowIcon className="flex justify-end" />
                </div>
                <div className="flex items-center justify-between my-10">
                  <Typography className="flex items-center text-black text-lg font-normal !font-semibold">
                    <LockIcon className="mr-2.5" />
                    30%
                  </Typography>
                  <Typography className="flex items-center text-black text-lg font-normal !font-semibold">
                    <UserIcon className="mr-2.5" />
                    585
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    fullWidth
                    color="Indigo"
                    className={`w-full text-sm md:text-base max-w-[8rem] font-normal rounded-full !bg-primary text-white h-10 maxMd:h-8  maxMd:max-w-[6rem]`}
                  >
                    Successful
                  </Button>
                  <Typography className="flex items-end flex-col text-black md:text-lg font-normal">
                    Duration
                    <span className="!font-bold maxMd:text-[0.75rem]">
                      2 Days
                    </span>
                  </Typography>
                </div>
              </div>
              <Typography className="bg-black text-white text-[0.65rem] md:text-base flex justify-center items-center w-full py-1 rounded-b-xl md:!font-medium">
                1000.000/1000.000BNB
              </Typography>
            </Card>
            <Card
              cardDesc="bg-g-card1 rounded-b-xl"
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
                  <Typography className="text-black ilo_heading_Text !font-semibold maxMd:text-lg ">
                    Dex Token (DT)
                  </Typography>
                  <LeftArrowIcon className="flex justify-end" />
                </div>
                <div className="flex items-center justify-between my-10">
                  <Typography className="flex items-center text-black text-lg font-normal !font-semibold">
                    <LockIcon className="mr-2.5" />
                    30%
                  </Typography>
                  <Typography className="flex items-center text-black text-lg font-normal !font-semibold">
                    <UserIcon className="mr-2.5" />
                    585
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Button
                    fullWidth
                    color="Indigo"
                    className={`w-full text-sm md:text-base max-w-[8rem] font-normal rounded-full !bg-primary text-white h-10 maxMd:h-8  maxMd:max-w-[6rem]`}
                  >
                    Successful
                  </Button>
                  <Typography className="flex items-end flex-col text-black md:text-lg font-normal">
                    Duration
                    <span className="!font-bold maxMd:text-[0.75rem]">
                      2 Days
                    </span>
                  </Typography>
                </div>
              </div>
              <Typography className="bg-black text-white text-[0.65rem] md:text-base flex justify-center items-center w-full py-1 rounded-b-xl md:!font-medium">
                1000.000/1000.000BNB
              </Typography>
            </Card>
          </Slider>
        </div>
      </Container>
    </div>
  );
};
export default Launchpad;
