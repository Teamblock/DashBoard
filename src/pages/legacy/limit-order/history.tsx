import React from "react";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { STOP_LIMIT_ORDER_ADDRESS } from "@sushiswap/limit-order-sdk";
import Container from "app/components/Container";
import Typography from "app/components/Typography";
import { Feature } from "app/enums";
import CompletedOrders from "app/features/legacy/limit-order/CompletedOrders";
import DiscoverHeader from "app/features/legacy/limit-order/DiscoverHeader";
import LimitOrderApprovalCheck from "app/features/legacy/limit-order/LimitOrderApprovalCheck";
import OrdersTableToggle from "app/features/legacy/limit-order/OrderTableToggle";
import useLimitOrders from "app/features/legacy/limit-order/useLimitOrders";
import NetworkGuard from "app/guards/Network";
import { TridentBody } from "app/layouts/Trident";
import { useActiveWeb3React } from "app/services/web3";
import { useBentoMasterContractAllowed } from "app/state/bentobox/hooks";
import Link from "next/link";

function OpenOrdersPage() {
  const { chainId, account } = useActiveWeb3React();
  const { i18n } = useLingui();
  const { pending } = useLimitOrders();
  const masterContract = chainId
    ? STOP_LIMIT_ORDER_ADDRESS[chainId]
    : undefined;
  const allowed = useBentoMasterContractAllowed(
    masterContract,
    account ?? undefined
  );

  return (
    <div className="w-full h-full flex items-center intro_section">
      <Container maxWidth="7xl" className="mx-auto px-2 pt-10 pb-10 md:pb-20">
        <LimitOrderApprovalCheck />
        <DiscoverHeader />
        <OrdersTableToggle
          className="grid grid-cols-2 items-center rounded-[0.350rem] !bg-black mb-5"
          tableToggle="h-full w-full cursor-pointer bg-primary rounded-[0.350rem] p-3"
          btnText="!font-semibold text-center"
        />
        <TridentBody classBody="bg-black h-full border border-Gray rounded-[0.350rem]">
          {pending.totalOrders > 0 &&
            typeof allowed !== "undefined" &&
            !allowed && (
              <div className="border border-Gray rounded-sm p-4">
                <Typography variant="sm" className="text-white">
                  {i18n._(t`It seems like you have open orders while the limit order master contract is not yet approved. Please make
          sure you have approved the limit order master contract or the order will not execute`)}
                </Typography>
              </div>
            )}
          <CompletedOrders thead="!border-b border-Gray" />
        </TridentBody>

        <Typography
          variant="xs"
          className="text-center mt-3 mb-40 !font-semibold text-lightGray"
        >
          Funds will be received in your{" "}
          <Link href="/portfolio" passHref={true}>
            <Typography
              variant="xs"
              className="text-blue !font-semibold "
              component="span"
            >
              BentoBox
            </Typography>
          </Link>{" "}
          after order execution
        </Typography>
      </Container>
    </div>
  );
}

OpenOrdersPage.Guard = NetworkGuard(Feature.LIMIT_ORDERS);

export default OpenOrdersPage;
