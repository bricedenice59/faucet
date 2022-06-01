import { useCallback, useEffect, useState } from "react";
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

  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);
  const [shouldReload, setShouldReload] = useState(false)

  const reloadEffect = useCallback(() => setShouldReload(!shouldReload), [shouldReload]);
  const setAccountListener = provider => {
    provider.on("accountsChanged", accounts => setAccount(accounts[0]))
  }
  useEffect(() => {
    const loadProvider = async () => {
      //metamask
      const provider = await detectEthereumProvider();
      const loaded_contract = await loadContract("Faucet", provider);

      if (provider) {
        setAccountListener(provider);
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

  useEffect(() => {
    const loadBalance = async () => {
      const balance = await web3Api.web3.eth.getBalance(web3Api.contract.address);
      setBalance(web3Api.web3.utils.fromWei(balance, "ether"));
    }
    web3Api.web3 && loadBalance();
  }, [web3Api.web3, shouldReload]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.addFunds({ "from": account, "value": web3.utils.toWei("1", "ether") });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdrawFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(withdrawAmount, { "from": account });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <span>
          <strong>Account:</strong>
        </span>
        {account ?
          <div>{account}</div> :
          <div>
            <button className="button is-primary is-light mr-2" onClick={() => {
              web3Api.provider.request({ method: "eth_requestAccounts" });
            }
            }>Connect</button>
          </div>
        }
        <span>
          <strong>Ganache contract address:</strong>
        </span>
        {web3Api.contract ?
          <div>{web3Api.contract.address}</div> :
          <div>Connect first...</div>
        }
        <div className="balance-view is-size-2 mb-4">
          <span>
            <strong>Current balance:</strong>
          </span>
          {balance ?
            <strong>{balance} ETH</strong> : <strong>  - ETH</strong>
          }
        </div>
        <button className="button mr-2" onClick={addFunds}>Donate 1 eth</button>
        <button className="button" onClick={withdrawFunds}>Withdraw 0.1eth</button>
      </div>
    </div >
  );
}

export default App;

//for truffle console
//const instance = await Faucet.deployed()
//instance.addFunds({from: accounts[0], value:"2000000000000000000"})