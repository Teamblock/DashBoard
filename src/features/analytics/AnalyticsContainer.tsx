import Head from "next/head";

import Container from "../../components/Container";
import Sidebar from "../../components/Sidebar";

// @ts-ignore TYPE NEEDS FIXING
export default function AnalyticsContainer({ children }): JSX.Element {
  return (
    <>
      <Head>
        <title>TWin Analytics | TWin</title>
        <meta
          name="description"
          content="EnergyfiSwap Liquidity Pair (SLP) Analytics by Energyfi"
        />
      </Head>
      <div className="w-full intro_section !h-auto">
        <Container
          id="analytics"
          maxWidth="6xl"
          className="mx-auto w-full h-full"
        >
          <div className="col-span-10 lg:col-span-8 3xl:col-span-7 maxLg:p-4">
            {children}
          </div>
        </Container>
      </div>
    </>
  );
}
