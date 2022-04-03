import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import gameContractAbi from '../utils/gameContractABI.json';
import profile from "../assets/profile-pic.png";
import honeyCoin from "../assets/honey-coin.png";
const GAME_CONTRACT_ADDRESS = '0x8c2ceD72Cf6CBFc39f62992619B50DADf2607d61';

function Dashboard(props) {
    const [myReward, setMyReward] = useState(0);
    const [myStamina, setMySatmina] = useState(0);

    const getStamina = async () => {

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, gameContractAbi, signer);
                const getStamina = await contract.getStamina();
                setMySatmina(parseInt(getStamina))

            }
        } catch (error) {
            console.log(error);
        }

    }

    const getReward = async () => {

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(GAME_CONTRACT_ADDRESS, gameContractAbi, signer);
                const getReward = await contract.getReward();
                setMyReward(parseInt(getReward) * 10 ** -18);

            }
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getStamina();
        getReward();
    }, []);

    return (<>
        <div className="text-xl text-white grid lg:grid-cols-2 gap-4" >
            <div className="lg:px-16 lg:py-16 p-8">
                <div className="rounded-3xl pb-4 bg-gradient-to-r from-[#4d1a00] via-[#802b00] to-[#4d1a00]  shadow-2xl">


                    <div className="grid grid-cols-2 rounded-lg bg-gradient-to-r from-[#4d1a00] via-red-500 to-[#4d1a00] hover:opacity-75 text-center text-2xl px-4 border-1 border-yellow-400 text-white "> Joe's Profile</div>
                    <center>
                        <img className="max-h-96 px-16" src={profile}></img></center>
                    <div className="pl-32 pr-32">
                        <a href="/startgame"> <div className="rounded-lg bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 text-center py-2 "> Play </div></a>
                    </div>
                </div>
            </div>
            <div className="lg:px-16 lg:py-16 p-8">

                <br />
                <div className="rounded-3xl pb-4 bg-gradient-to-r from-[#4d1a00] via-[#802b00] to-[#4d1a00]  shadow-2xl">
                    <div className="rounded-lg bg-gradient-to-r from-[#4d1a00] via-red-500 to-[#4d1a00] hover:opacity-75   px-4 border-1 border-yellow-400 text-white">
                        <p className="p-2 ">Current Address</p>
                    </div>
                    <p className="pl-4 text-center">{props.address.slice(0, 7)}...{props.address.slice(-7)}</p>
                </div>
                <br />
                <div className="rounded-3xl pb-4 bg-gradient-to-r from-[#4d1a00] via-[#802b00] to-[#4d1a00]  shadow-2xl">
                    <div className="rounded-lg bg-gradient-to-r from-[#4d1a00] via-red-500 to-[#4d1a00] hover:opacity-75   px-4 border-1 border-yellow-400 text-white">
                        <p className="p-2 ">My Rewards</p>
                    </div>



                    <div className="grid grid-cols-2 pt-4 p-2">
                        <div className="grid grid-cols-2  rounded-lg bg-gradient-to-r from-[#dfad51c4] via-red-500 to-[#4d1a00] text-center text-2xl px-4 border-1 border-yellow-400 text-white ">
                            <img src={honeyCoin} className="max-h-8 text-center text-2xl pt-2"></img>
                            <p className="p-2 ">{myReward}</p>
                        </div>
                        <div className="pl-4">
                            <div className=" p-3 pl-4 rounded-lg bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:opacity-75 text-center text-2xl px-4 border-2 border-yellow-400 text-white">
                                <button ><span>Redeem Reward</span></button>
                            </div>
                        </div>

                    </div>
                </div>
                <br />
                <div className="rounded-3xl pb-4 bg-gradient-to-r from-[#4d1a00] via-[#802b00] to-[#4d1a00]  shadow-2xl">
                    <div className="rounded-lg bg-gradient-to-r from-[#4d1a00] via-red-500 to-[#4d1a00] hover:opacity-75   px-4 border-1 border-yellow-400 text-white">
                        <p className="p-2 ">Joe's Stamina:<span className="pl-4">{myStamina}</span></p>
                    </div>
                    <p></p>
                    <div className="grid grid-cols-2">
                        <div className="p-4"><input className='px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-3 shadow outline-black focus:outline-black focus:ring' type="text" placeholder="Increase Stamina"></input></div>
                        <div className=" p-4 "><button className='rounded-lg bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:opacity-75 text-center text-2xl px-4 border-2 border-yellow-400 text-white'>increase</button></div>
                    </div>

                </div>
            </div>
        </div></>);

}
export default Dashboard;