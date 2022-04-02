import giftImage from "../assets/mystery-box.png";
function MystryBox(props) {
    return (
        <>
            <div className="text-3xl pt-8 text-white flex justify-center">
                <center>
                    <p className="bg-[#331100] rounded-full p-3">MisteryBox</p>
                </center>
            </div>
            <div className=" lg:px-32 px-8 pt-2">
                <div className="rounded-3xl bg-[#33110060]   grid lg:grid-cols-2">
                    <div className="p-8 lg:px-32">
                        <div className="rounded-3xl pb-4 bg-gradient-to-r from-[#4d1a00] via-[#802b00] to-[#4d1a00]  shadow-2xl ">
                            <center> <img className="max-h-60 " src={giftImage}></img> </center>
                            <br />
                            <center><input className='px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white rounded text-sm border-3 shadow outline-black focus:outline-black focus:ring' type="text" placeholder="Enter referral ID"></input></center>
                            <div className="pt-3">
                                <center><button className='rounded-lg bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:opacity-75 text-center text-2xl p-2 px-4 border-2 border-yellow-400 text-white'>Buy</button></center>
                            </div>

                        </div>
                    </div>
                    <div className="p-8 lg:px-32">
                        <div className="rounded-3xl pb-4 bg-gradient-to-r from-[#4d1a00] via-[#802b00] to-[#4d1a00]  shadow-2xl ">
                            <center> <img className="max-h-60 " src={giftImage}></img> </center>
                            <br />
                            <center><button className='rounded-lg bg-gradient-to-r from-red-800 via-red-600 to-red-800 hover:opacity-75 text-center text-2xl p-2 px-4 border-2 border-yellow-400 text-white'>Buy</button></center>
                        </div>
                    </div>
                </div>
            </div>

        </>);
}
export default MystryBox;