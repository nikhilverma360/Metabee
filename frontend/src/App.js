import React, { useEffect, useState } from "react";
import Navbar from "./components/items/Navbar";
import Dashboard from "./components/Dashboard";
import MysteryBox from "./components/MysteryBox";
import StartGame from "./components/StartGame";
import NFTcollections from "./components/NFTcollection";
import Farms from "./components/Farms";
import Marketplace from "./components/Marketplace";
import { networks } from './utils/networks';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import bgImage from './assets/bg-page-content.svg';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [network, setNetwork] = useState('');
  // Implement connectWallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      // Boom! This should print out public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }

    // This is the new part, we check the user's network chain ID
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    setNetwork(networks[chainId]);

    ethereum.on('chainChanged', handleChainChanged);

    // Reload the page when they change networks
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        // Try to switch to the Mumbai testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
        });
      } catch (error) {
        // This error code means that the chain we want has not been added to MetaMask
        // In this case we ask the user to add it to their MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x13881',
                  chainName: 'Polygon Mumbai Testnet',
                  rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                  nativeCurrency: {
                    name: "Mumbai Matic",
                    symbol: "MATIC",
                    decimals: 18
                  },
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (<>
    <center>
      <div className="text-6xl pt-32">
        <button onClick={connectWallet} className="rounded-lg bg-yellow-400 hover:opacity-75 p-8">
          Connect Wallet
        </button>
      </div>
    </center>
  </>
  );

  const renderConnectedContainer = () => {
    if (network !== 'Polygon Mumbai Testnet') {
      return (<>
        <center>
          <div className="text-6xl pt-32">
            <h2>Please switch to Polygon Mumbai Testnet</h2>
            <br />
            {/* This button will call our switch network function */}
            <button className='rounded-lg bg-yellow-400 hover:opacity-75 p-8' onClick={switchNetwork}>Click here to switch</button>
          </div>
        </center>
      </>
      );
    }
    return (<div >
      <Router>
        <Routes>
          <Route path="/" caseSensitive={false} element={<Dashboard address={currentAccount} />} />
          <Route path="/dashboard" caseSensitive={false} element={<Dashboard address={currentAccount} />} />
          <Route path="/MysteryBox" caseSensitive={false} element={<MysteryBox address={currentAccount} />} />
          <Route path="/StartGame" caseSensitive={false} element={<StartGame address={currentAccount} />} />
          <Route path="/Collections" caseSensitive={false} element={<NFTcollections address={currentAccount} />} />
          <Route path="/Marketplace" caseSensitive={false} element={<Marketplace address={currentAccount} />} />
          <Route path="/Farms" caseSensitive={false} element={<Farms address={currentAccount} />} />

        </Routes>
      </Router>
    </div>);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    < div className="w-full h-screen font-Righteous font-bold bg-scroll" style={{
      backgroundImage: `url(${bgImage})`,
      backgroundPosition: 'top',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}>
      <Navbar />
      {!currentAccount && renderNotConnectedContainer()}
      {currentAccount && renderConnectedContainer()}
    </div >
  );
}

export default App;
