import React from "react";

export default function Navbar({ fixed }) {
    const [navbarOpen, setNavbarOpen] = React.useState(false);
    return (
        <div className="py-2 shadow-2xl bg-[#331100] text-xl">
            <nav className="relative flex flex-wrap items-center justify-between px-2 py-2 bg-gradient-to-r from-[#4d1a00] via-[#802b00] to-[#4d1a00]  shadow-2xl ">
                <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                    <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                        <a
                            className="font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
                            href="#pablo"
                        >
                            MetaBee
                        </a>
                        <button
                            className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-white rounded bg-transparent block lg:hidden outline-white focus:outline-none"
                            type="button"
                            onClick={() => setNavbarOpen(!navbarOpen)}
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                    <div
                        className={
                            "lg:flex flex-grow items-center" +
                            (navbarOpen ? " flex" : " hidden")
                        }
                        id="example-navbar-danger"
                    >
                        <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
                            <li className="nav-item">
                                <a
                                    className="px-3 py-2 flex items-center  uppercase font-bold leading-snug text-white hover:opacity-75"
                                    href="/dashboard"
                                >
                                    <span className="ml-2">Dashboard</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="px-3 py-2 flex items-center  uppercase font-bold leading-snug text-white hover:opacity-75"
                                    href="collections"
                                >
                                    <span className="ml-2">Collections</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="px-3 py-2 flex items-center  uppercase font-bold leading-snug text-white hover:opacity-75"
                                    href="/MysteryBox"
                                >
                                    <span className="ml-2">Mystery Box</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="px-3 py-2 flex items-center  uppercase font-bold leading-snug text-white hover:opacity-75"
                                    href="/marketplace"
                                >
                                    <span className="ml-2">Marketplace</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="px-3 py-2 flex items-center  uppercase font-bold leading-snug text-white hover:opacity-75"
                                    href="/farms"
                                >
                                    <span className="ml-2">farms</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <div className="pl-10">
                                    <a
                                        className="px-3 py-2 flex items-center  uppercase font-bold leading-snug text-white hover:opacity-75 rounded-lg bg-yellow-400"
                                        href="/startgame"
                                    >
                                        <span className="ml-2">Play</span>
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}