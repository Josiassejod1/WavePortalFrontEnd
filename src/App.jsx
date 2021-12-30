import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/wave.json";
import './App.css';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [waveText, setText] = useState('');
   const [allWaves, setAllWaves] = useState([]);
   const contractAddress = "0x36d6fAAa3b8031115921C97137BCc08b88A97A19";
      const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
          getTotalCount();
          getAllWaves();
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  function onChange(event) {
    console.log(event.target.value);
    setText(event.target.value);
  }

  const getAllWaves =  async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

      const signer = provider.getSigner();

      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      const waves = await wavePortalContract.getAllWaves();
      console.log("Getting waves");
      console.log(waves);

      let wavesCleaned = [];

      waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

         setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
    } }
     catch(error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])


   const getTotalCount = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
         const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
          let count = await wavePortalContract.getTotalWaves();
  }

  const wave = async () => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

     
         const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
          let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

         /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(waveText);
        setText('');
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        setTotalCount(count.toNumber());
        console.log("Retrieved total wave count...", count.toNumber());
      }
    } catch(error) {
      console.log(error);
    }
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Sak Pase 🇭🇹 (What's Up)!
        </div>

        <div className="bio">
        Hey my name is Dalvin. Dev, Author, and Crypto Ethusiast. ay wassup on the blockchain. Connect your Ethereum wallet and wave at me!
        </div>

        {(currentAccount  && (totalCount != 0))  && (<div>
          <h1>Total Waves: {totalCount}</h1>
        </div>)}

        {
          <input type="text" placeholder="Say Hello !" onChange={onChange}>
          </input>
        }

       {
         currentAccount && (
          <button className="waveButton" onClick={wave} disabled={waveText === ''}>
            Wave at Me
          </button>
         )
       }

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

         {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

      </div>
    </div>
  );
}
