import React, { useEffect, useState } from "react";

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
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
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <div className="fill-slate-100">
      <button onClick={connectWallet} className="bg-sky-600 hover:bg-sky-700 rounded-lg">
        Connect Wallet
      </button>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (

    < div >
      <h1 className="text-5xl font-bold underline">
        Hello world!
      </h1>
      {/* Hide the connect button if currentAccount isn't empty*/}
      {!currentAccount && renderNotConnectedContainer()}
    </div >
  );
}

export default App;
