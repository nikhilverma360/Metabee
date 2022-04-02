import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import gameContractAbi from '../utils/gameContractABI.json';
import profile from "../assets/profile-pic.png";
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
                <div className="p-2 rounded-3xl bg-[#b24337f1] justify-items-center border-8 border-[#331100]">
                    <center>
                        <img className="max-h-96 px-16" src={profile}></img></center>
                    <div className="pl-32 pr-32">
                        <div className="rounded-lg bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 text-center py-2 "> Joe's Profile</div>
                    </div>
                </div>
            </div>
            <div className="lg:px-16 lg:py-16 p-8">

                <br />
                <div className="p-2 rounded-3xl bg-[#b24337f1] justify-items-center border-8 border-[#331100]">
                    <p>Current Address: {props.address.slice(0, 6)}...{props.address.slice(-6)}</p>
                </div>
                <br />
                <div className="p-2 rounded-3xl bg-[#b24337f1] justify-items-center border-8 border-[#331100]">
                    <p>Reward : {myReward} </p>
                    <button className='bg-sky-600 hover:bg-sky-700 rounded-lg'>claim</button>
                </div>
                <br />
                <div className="p-2 rounded-3xl bg-[#b24337f1] justify-items-center border-8 border-[#331100]">
                    <p>Stamina : {myStamina}</p>
                    increase stamina <input className='px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-3 shadow outline-black focus:outline-black focus:ring' type="text"></input>
                    <button className='bg-sky-600 hover:bg-sky-700 rounded-lg'>increase</button>
                </div>
            </div>
        </div></>);

}
export default Dashboard;