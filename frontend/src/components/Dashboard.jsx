import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import gameContractAbi from '../utils/gameContractABI.json';
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

    return (
        <div className="text-xl text-white" >
            <h1>Dashboard</h1><hr /><br />
            Your Address is {props.address}
            <br />
            Reward : {myReward} <br />
            <button className='bg-sky-600 hover:bg-sky-700 rounded-lg'>claim</button>
            <br />
            Stamina : {myStamina}<br />
            increase stamina <input className='px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-3 shadow outline-black focus:outline-black focus:ring' type="text"></input>
            <button className='bg-sky-600 hover:bg-sky-700 rounded-lg'>increase</button>
        </div>);

}
export default Dashboard;