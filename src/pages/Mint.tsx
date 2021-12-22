import React from "react";
import { useSelector } from "react-redux";

import TabContainer from "../components/mint/TabContainer";
import WalletDropdown from "../components/mint/WalletDropdown";
import { RootState } from "../store";

const Mint = () => {
  const wallets = useSelector((state: RootState) =>
    state.wallets.filter((wallet) => wallet.balance > 0)
  );
  return (
    <div>
      <WalletDropdown wallets={wallets} />
      <TabContainer />
    </div>
  );
};

export default Mint;
