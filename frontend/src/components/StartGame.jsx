import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import nftContractAbi from '../utils/nftContractABI.json';
import gameContractAbi from '../utils/gameContractABI.json';

const NFT_CONTRACT_ADDRESS = '0x1bA5aA692435Aa44D5976de248607B3FBDd4c017';
const GAME_CONTRACT_ADDRESS = '0x8c2ceD72Cf6CBFc39f62992619B50DADf2607d61';



function StartGame(props) {
    const [selectedNFT, setSelectedNFT] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(0);
    const [nftIDs, setNFTids] = useState([]);
    const [gameJoined, setgameJoined] = useState("Join");

    const fetchMints = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftContractAbi, signer);
                const walletOfOwner = await contract.walletOfOwner(props.address);
                for (let index = 0; index < walletOfOwner.length; index++) {
                    if (walletOfOwner.length > nftIDs.length) {
                        const element = parseInt(walletOfOwner[index]);
                        setNFTids(nftIDs => [...nftIDs, element]);
                        console.log("owner ", element);
                    }
                }
                console.log(nftIDs)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const isGameJoined = async () => {
        if (gameJoined === "Join") {
            try {
                const { ethereum } = window;
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, gameContractAbi, signer);
                    const getStamina = await contract.getStamina();
                    if (parseInt(getStamina) > 0) {
                        setgameJoined("Search");
                    }

                }
            } catch (error) {
                console.log(error);
            }
        }

    }

    const joinGame = async () => {
        if (gameJoined === "Join") {

            try {
                const { ethereum } = window;
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, gameContractAbi, signer);
                    console.log("Going to pop wallet now to pay gas...")
                    let tx = await contract.joinGame();
                    const receipt = await tx.wait();
                    if (receipt.status === 1) {
                        console.log("Game Joined! https://mumbai.polygonscan.com/tx/" + tx.hash);
                        setgameJoined("Search");
                    } else {
                        alert("Transaction failed! Please try again");
                    }

                }
            } catch (error) {
                console.log(error);
            }
        }

        if (gameJoined === "Search" && selectedLocation !== 0 && selectedNFT !== 0) {
            try {
                const { ethereum } = window;
                if (ethereum) {
                    const provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, gameContractAbi, signer);
                    console.log("Going to pop wallet now to pay gas...")
                    let tx = await contract.startHunting(selectedNFT, selectedLocation);
                    const receipt = await tx.wait();
                    if (receipt.status === 1) {
                        console.log("Game Joined! https://mumbai.polygonscan.com/tx/" + tx.hash);
                    } else {
                        alert("Transaction failed! Please try again");
                    }

                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        isGameJoined();
        fetchMints();
    }, []);

    // render functions
    const renderMints = () => {
        if (nftIDs.length > 0) {
            return (
                <div className="mint-container">
                    <p className="subtitle"> Recently minted NFTs!</p>
                    <div className="mint-list">
                        <div className="radio-btn-container">
                            {nftIDs.map((nft) => {
                                return (<>
                                    <div
                                        className="radio-btn"
                                        onClick={() => {
                                            setSelectedNFT(nft);
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            value={selectedNFT}
                                            name={nft}
                                            checked={selectedNFT === nft}
                                        />
                                        Your NFT is {nft}
                                    </div>
                                    {/* <div className="mint-item" key={nft}>
                                        <div className='mint-row'>
                                            <a className="link" href={`https://testnets.opensea.io/assets/mumbai/${NFT_CONTRACT_ADDRESS}/${nft}`} target="_blank" rel="noopener noreferrer">
                                                <p className="underlined">{' '} Your NFT is {nft}{' '}</p>
                                            </a>

                                        </div>
                                    </div> */}
                                </>)
                            })}
                        </div>
                    </div>
                </div>);
        }
    };


    const renderLocations = () => (
        <>
            <h1>Choose Locations</h1>
            <div className="radio-btn-container">
                <div
                    className="radio-btn"
                    onClick={() => {
                        setSelectedLocation(1);
                    }}
                >
                    <input
                        type="radio"
                        value={selectedLocation}
                        name="100% lucky"
                        checked={selectedLocation === 1}
                    />
                    100% lucky
                </div>
                <div
                    className="radio-btn"
                    onClick={() => {
                        setSelectedLocation(2);
                    }}
                >
                    <input
                        type="radio"
                        value={selectedLocation}
                        name="0% lucky"
                        checked={selectedLocation === 2}
                    />
                    0% lucky
                </div>
                <div
                    className="radio-btn"
                    onClick={() => {
                        setSelectedLocation(3);;
                    }}
                >
                    <input
                        type="radio"
                        value={selectedLocation}
                        name="50% lucky"
                        checked={selectedLocation === 3}
                    />
                    50% lucky
                </div>
            </div>
        </>
    );

    return (<>
        <h1>StartGame</h1>
        {renderMints()}
        Your Selected NFT IS  {selectedNFT}
        <br />

        <hr />
        location<br />
        {renderLocations()}
        Your Selected location is  {selectedLocation}
        <br />
        <hr />

        <button className='bg-sky-600 hover:bg-sky-700 rounded-lg' onClick={joinGame} > {gameJoined}</button>
        {console.log("Game joined", gameJoined)}




    </>);
}
export default StartGame;