import { useEffect, useState } from "react";
import React from "react";
import Web3 from "web3";
import "./App.css";

function App() {
  const initialCount = 5;

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null
  });

  useEffect(() => {
    const loadProvider = async () => {
      //metamask
      let provider = null;

      //latest version
      if (window.ethereum) {
        provider = window.ethereum;

        try {
          provider.enable();
        } catch {
          console.error("user denied accounts access!");
        }
      }
      //legacy versions
      else if (window.web3) {
        provider = window.web3.currentProvider;
      }
      else if (!process.env.production) {
        provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
      }

      setWeb3Api(provider, new Web3(provider));
    }
    loadProvider()
  }, []);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="balance-view is-size-2">
          Current Balance: <strong>10</strong> ETH
        </div>
        <button className="btn mr-2" onClick={async () => {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
          console.log(accounts)
        }
        }>Enable Ethereum</button>
        <button className="btn mr-2">Donate</button>
        <button className="btn">Withdraw</button>
      </div>
    </div>
  );
}

export default App;
