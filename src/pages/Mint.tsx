import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import TabContainer from "../components/mint/TabContainer";
import WalletDropdown from "../components/mint/WalletDropdown";
import { RootState } from "../store";
import { thunkFetchWallets } from "../store/actions/walletActions";

const Mint = () => {
  const wallets = useSelector((state: RootState) =>
    state.wallets.filter((wallet) => wallet.balance > 0)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!wallets || !wallets.length) {
      dispatch(thunkFetchWallets());
    }
  }, [wallets]);

  return (
    <div>
      <WalletDropdown wallets={wallets} />
      <TabContainer />
    </div>
  );
};

export default Mint;
