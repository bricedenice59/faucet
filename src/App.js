import { useEffect, useState } from "react";
import React from "react";
import Web3 from "web3";
import "./App.css";
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from "./Utils/contract-utils";

function App() {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  });

  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      //metamask
      const provider = await detectEthereumProvider();
      const loaded_contract = await loadContract("Faucet", provider);

      debugger
      if (provider) {
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract: loaded_contract
        });
      } else {
        console.log('Please install MetaMask!');
      }
    }
    loadProvider()
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <span>
          <strong>Account:</strong>
        </span>
        {account ?
          <div>{account}</div> :
          <button className="button is-primary is-light mr-2" onClick={() => {
            web3Api.provider.request({ method: "eth_requestAccounts" });
          }
          }>Connect</button>
        }
        <div className="balance-view is-size-2 mb-4">
          Current Balance: <strong>10</strong> ETH
        </div>
        <button className="button mr-2">Donate</button>
        <button className="button">Withdraw</button>
      </div>
    </div>
  );
}

export default App;
