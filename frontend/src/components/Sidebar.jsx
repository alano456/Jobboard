import { Bell, Bookmark, BriefcaseBusiness, CirclePlus, LayoutDashboard, LogOut, Settings } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const EmployerSidebar = ({ mode, setMode }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('is_employer');
        navigate('/')
    }

    return (
        <div className="flex pt-4 items-start flex-col text-gray-500 h-full w-72 border-r bg-white border-gray-300">
            <div className="flex flex-col w-full">
                <p className=" pl-9 py-2 font-medium text-[12px] ">Panel główny pracodawcy</p>
                <div className="flex pl-4 items-start flex-col mt-2 w-full text-sm justify-start ">
                    <button
                        onClick={() => setMode("main")} className={` ${mode === 'main' && 'bg-purple-100 border-l-4 border-purple-900 text-purple-900 hover:bg-purple-100  hover:border-l-4'} hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row w-full  items-center justify-start gap-3 px-4 py-3 cursor-pointer `}>
                        <LayoutDashboard />
                        <span>Ogólne</span>
                    </button>
                    <button
                        onClick={() => setMode("newjob")}
                        className={` ${mode === 'newjob' && 'bg-purple-100 border-l-4 border-purple-900 text-purple-900 hover:bg-purple-100  hover:border-l-4  '} hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row w-full  items-center justify-start gap-3 px-4 py-3 cursor-pointer `}>
                        <CirclePlus />
                        <span>Opublikuj ogłoszenie</span>
                    </button>
                    <button
                        onClick={() => setMode("alljob")} className={` ${mode === 'alljob' && 'bg-purple-100  hover:bg-purple-100  hover:border-l-4 border-l-4 border-purple-900 text-purple-900 '} hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row w-full  items-center justify-start gap-3 px-4 py-3 cursor-pointer `}>
                        <BriefcaseBusiness />
                        <span>Opublikowane ogłoszenia</span>
                    </button>
                    <button
                        onClick={() => setMode("allcandidates")} className={` ${mode === 'allcandidates' && 'bg-purple-100 hover:bg-purple-100  hover:border-l-4 border-l-4 border-purple-900 text-purple-900 '} hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row w-full  items-center justify-start gap-3 px-4 py-3 cursor-pointer `}>
                        <Bookmark />
                        <span>Zapisani kandydaci</span>
                    </button>
                    <button
                        onClick={() => setMode("settings")} className={` ${mode === 'settings' && 'bg-purple-100 hover:bg-purple-100  hover:border-l-4 border-l-4 border-purple-900 text-purple-900 '} hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row w-full  items-center justify-start gap-3 px-4 py-3 cursor-pointer `}>
                        <Settings />
                        <span>Ustawenia</span>
                    </button>
                </div>
            </div>
            <div className="flex mt-auto flex-col w-full">
                <button onClick={logout} className="ml-4 mb-4 hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row  items-center justify-start gap-3 px-5 py-3 cursor-pointer ">
                    <LogOut />
                    <span>Wyloguj się</span>
                </button>
            </div>

        </div>
    )

}


export const UserSidebar = ({ mode, setMode }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('is_employer');

        navigate('/')


    }

    return (
        <div className="flex pt-4 items-start flex-col text-gray-500 h-full w-72 border-r bg-white border-gray-300">
            <div className="flex flex-col w-full">
                <p className=" pl-9 py-2 font-medium text-[12px] ">Panel Kandydata</p>
                <div className="flex pl-4 items-start flex-col mt-2 w-full text-sm justify-start ">
                    <button
                        onClick={() => setMode("main")} className={` ${mode === 'main' && 'bg-purple-100 border-l-4 border-purple-900 text-purple-900 hover:bg-purple-100  hover:border-l-4'} hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row w-full  items-center justify-start gap-3 px-4 py-3 cursor-pointer `}>
                        <LayoutDashboard />
                        <span>Ogólne</span>
                    </button>
                    <button
                        onClick={() => setMode("aplied")}
                        className={` ${mode === 'aplied' && 'bg-purple-100 border-l-4 border-purple-900 text-purple-900 hover:bg-purple-100  hover:border-l-4  '} hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row w-full  items-center justify-start gap-3 px-4 py-3 cursor-pointer `}>
                        <BriefcaseBusiness />
                        <span>Aplikowane stanowiska</span>
                    </button>
                    <button
                        onClick={() => setMode("saved")} className={` ${mode === 'saved' && 'bg-purple-100  hover:bg-purple-100  hover:border-l-4 border-l-4 border-purple-900 text-purple-900 '} hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row w-full  items-center justify-start gap-3 px-4 py-3 cursor-pointer `}>
                        <Bookmark />
                        <span>Zapisane oferty</span>
                    </button>
                    <button
                        onClick={() => setMode("notifications")} className={` ${mode === 'notifications' && 'bg-purple-100 hover:bg-purple-100  hover:border-l-4 border-l-4 border-purple-900 text-purple-900 '} hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row w-full  items-center justify-between gap-3 px-4 py-3 cursor-pointer `}>
                        <div className="flex items-center gap-3">
                            <Bell />
                            <span>Powiadomienia</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setMode("settings")} className={` ${mode === 'settings' && 'bg-purple-100 hover:bg-purple-100  hover:border-l-4 border-l-4 border-purple-900 text-purple-900 '} hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row w-full  items-center justify-start gap-3 px-4 py-3 cursor-pointer `}>
                        <Settings />
                        <span>Ustawenia</span>
                    </button>
                </div>
            </div >
            <div className="flex mt-auto flex-col w-full">
                <button onClick={logout} className="ml-4 mb-4 hover:bg-gray-100 hover:text-gray-600 hover:border-0 flex flex-row  items-center justify-start gap-3 px-5 py-3 cursor-pointer ">
                    <LogOut />
                    <span>Wyloguj się</span>
                </button>
            </div>

        </div >
    )

}

