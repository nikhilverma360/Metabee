import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import nftContractAbi from '../utils/nftContractABI.json';

const NFT_CONTRACT_ADDRESS = '0x1bA5aA692435Aa44D5976de248607B3FBDd4c017';
function NFTcollection(props) {
    const [nftIDs, setNFTids] = useState([]);


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
                        console.log("NFT fetched .. ID is - ", element);
                    }
                }
                console.log(nftIDs)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchMints();
    }, []);

    //render functions
    const renderMints = () => {
        if (nftIDs.length > 0) {
            return (
                <div className="">
                    <p className=""> Recently minted NFTs!</p>
                    <div className="">
                        <div className="">
                            {nftIDs.map((nft) => {
                                return (<>
                                    <div>
                                        Your NFT is {nft}
                                    </div>
                                </>)
                            })}
                        </div>
                    </div>
                </div>);
        }
    };


    return (<>
        <div className="text-3xl pt-8 text-white flex justify-center">
            <center>
                <p className="bg-[#331100] rounded-full p-3">My NFT Collections</p>
            </center>
        </div>
        <div className=" lg:px-32 px-8 pt-2">
            <div className="rounded-3xl bg-[#33110060]   grid lg:grid-cols-3">
                {renderMints()}
            </div>
        </div>

    </>);
}
export default NFTcollection;