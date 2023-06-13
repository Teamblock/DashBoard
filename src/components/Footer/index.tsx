import React, { FC, useState } from "react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import router from "next/router";
// import { Chainsulting, EnergyFiLogo } from 'app/components/Icon'
import Typography from "app/components/Typography";
import Container from "../Container";
import Divider from "../Divider";
import FooterIcons from "./FooterIcons";
import Button from "../Button";
import Devlogo from "../../../public/images/Devlogo.png";
import { SFIcon } from "../Icon";

const Footer = () => {
  const { i18n } = useLingui();
  const path = window.location.pathname;
  const [email, setEmail] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("email", email);
    setEmail("");
  };

  return (
    <>
      <div className="bg-[#1a202e] z-10 w-full flex flex-col items-center">
        <Container maxWidth="6xl" className="mx-auto p-4">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5 md:gap-3">
            <div className="w-full max-w-sm md:max-w-xs">
              {/* <EnergyFiLogo className='-ml-2 mb-3 mt-2 md:w-48 w-32  h-auto cursor-pointer'
              onClick={() => {
                router.push(`/`)
              }}
            /> */}
              <div className="md:w-48 w-[9.5rem] maxMd:h-[6rem] mt-6 mb-3">
                <img
                  src={Devlogo.src}
                  alt="energyfiLogo"
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`/`);
                  }}
                />
              </div>

              <Typography
                variant="sm"
                className=" text-white-700 leading-[1.5rem]"
              >
                {i18n._(
                  t`Dex is designing green and cost-effective Decentralized Finance by providing a complete set of DeFi features on Avax, Near, Bsc and 
                  Echain (Dex Chain) all while accelerating their adoption.`
                )}
              </Typography>
              
            </div>
            <div className="flex justify-end">
              <div className="grid md:grid-cols-04 grid-cols-1 pb-10 pt-7 w-full mt-[0.7rem] md:mt-[3.7rem] relative">
              <div className="absolute right-0">
                <h1 className="text-white text-end font-bold">Contact Us</h1>
                <FooterIcons footerIconsCss="mt-4 md:-ml-3" />
              </div>
              </div>
            </div>
          </div>
          <div className="w-full flex md:justify-between maxMd:flex-col maxMd:justify-around items-center md:pt-5 maxMd:h-[6rem] maxMd:my-[1rem]">
            <Typography variant="sm" className="!font-light	 text-white-700">
              {i18n._(t`contact@dex.io`)}
            </Typography>
            <Typography variant="sm" className="!font-light text-white-700">
              {i18n._(t`© 2023 by Dex`)}
            </Typography>
          </div>
        </Container>
      </div>
      <div className="justify-center items-center flex w-full bg-[#1a202e] py-4 maxMd:py-5">
        <Typography
          variant="sm"
          className="text-white-700 mr-2.5 hover:text-high-emphesis font-bold"
        >
          {i18n._(t`Audited by:`)}
        </Typography>
        <SFIcon height={31} className="mr-[0.6rem]" />
        {/* <Chainsulting width={125} height={50} /> */}
      </div>
    </>
  );
};
export default Footer;
