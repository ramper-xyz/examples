import { useState, useMemo } from "react";
import {
  init,
  signIn,
  signOut,
  getRamperSigner,
  WALLET_PROVIDER,
  openWallet,
} from "@ramper/ethereum";
import { ethers } from "ethers";
import { get } from "lodash";

init({
  appName: "Ethereum Test App",
  network: "maticmum",
  authProviders: ["google", "facebook", "email", "apple", "twitter"],
  walletProviders: ["metamask"],
  theme: "dark",
});

const App = () => {
  const [user, setUser] = useState();
  const wallet = useMemo(
    () => get(user, ["wallets", "ethereum"], null),
    [user]
  );
  const [txResult, setTxResult] = useState();

  const handleSignIn = async () => {
    const signInResult = await signIn();
    if (signInResult.error) return;

    setUser(signInResult.user);
  };

  const handleSendFromWallet = async () => {
    if (!wallet) {
      return;
    }

    try {
      if (wallet.provider === WALLET_PROVIDER.METAMASK) {
        const ethereum = window.ethereum;
        let provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const txResult = await signer.sendTransaction({
          from: wallet.publicKey,
          to: "0x4F08815944E166Bc76A8C91CE7dcD0f5BD5ae424",
          value: "0.00001",
          chainId: 80001,
        });

        console.log("txResult", txResult);
        setTxResult(txResult);
        return;
      }

      const alchemy = new ethers.providers.AlchemyProvider(
        "maticmum",
        "pEWvHrkSkkyWGZmezdGMk_LjYu8DAx1k"
      );
      const signer = await getRamperSigner(alchemy);

      const fromAddress = wallet.publicKey;
      const toAddress = "0x4F08815944E166Bc76A8C91CE7dcD0f5BD5ae424";
      const value = "0.00001";

      const gas = await alchemy.getFeeData();
      const estimagedGas = await alchemy.estimateGas({
        to: toAddress,
        value: ethers.utils.parseEther(value),
      });
      const nonce = await alchemy.getTransactionCount(fromAddress);

      const signedTx = await signer.signTransaction({
        from: fromAddress,
        to: toAddress,
        value: ethers.utils.parseEther(value),
        type: 2,
        chainId: 80001,
        nonce,
        gasLimit: estimagedGas,
        gasPrice: gas.maxFeePerGas,
        maxFeePerGas: gas.maxFeePerGas,
        maxPriorityFeePerGas: gas.maxPriorityFeePerGas,
      });

      const txResult = await alchemy.sendTransaction(signedTx);
      setTxResult(txResult);
      console.log(txResult);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div>CRA Example</div>
      <button onClick={handleSignIn}>Sign in</button>
      <p>{JSON.stringify(user)}</p>
      <button onClick={signOut}>Sign out</button>
      <button onClick={handleSendFromWallet}>Send from wallet</button>
      <p>{JSON.stringify(txResult)}</p>
      <button onClick={openWallet}>OpenWallet</button>
    </div>
  );
};

export default App;
