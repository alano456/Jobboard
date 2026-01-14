import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "./Badge";
import { Bell, BriefcaseBusiness, Check, MapPin } from "lucide-react";
import { Salary } from "./Salary";


export const NavbarEmployer = ({ setMode }) => {

    return (<>

        <div className=" flex items-center justify-between flex-row bg-white w-full h-16 px-10 border-b border-gray-300">
            <div className=" cursor-pointer" onClick={() => setMode("main")}>
                <div className="flex flex-row items-center justify-center gap-2">
                    <BriefcaseBusiness className="size-8 text-purple-900" />
                    <p className="text-md font-bold">JobBoard</p>
                </div>
            </div>

            <div className="flex items-center justify-center lg:gap-24 md:gap-12 sm:gap-6 text-sm font-medium text-gray-600">
                <button onClick={() => setMode("search_jobs")} className="cursor-pointer hover:text-purple-800 transition-colors">Szukaj pracy</button>
                <button onClick={() => setMode("search_candidates")} className="cursor-pointer hover:text-purple-800 transition-colors">Szukaj pracownika</button>
                <button onClick={() => setMode("main")} className="cursor-pointer hover:text-purple-800 transition-colors">Panel główny</button>
            </div>

            <div className="flex items-center justify-center gap-6">
                <div onClick={() => setMode("notifications")} className="relative cursor-pointer ">
                    <Bell className="hover:rotate-12 transition-transform duration-300 ease-in-out" />
                    <div className="bg-pink-600 w-3 h-3 rounded-full absolute top-0 -right-0.5"></div>
                </div>

                <div className="bg-purple-800 w-10 h-10 rounded-full"></div>
            </div>
        </div>


    </>)


}



export const NavbarUser = ({ setMode }) => {

    return (<>

        <div className=" flex items-center justify-between flex-row bg-white w-full h-16 px-10 border-b border-gray-300">
            <div className=" cursor-pointer" onClick={() => setMode("main")}>
                <div className="flex flex-row items-center justify-center gap-2">
                    <BriefcaseBusiness className="size-8 text-purple-900" />
                    <p className="text-md font-bold">JobBoard</p>
                </div>
            </div>

            <div className="flex items-center justify-center lg:gap-24 md:gap-12 sm:gap-6 text-sm font-medium text-gray-600">
                <button onClick={() => setMode("search_jobs")} className="cursor-pointer hover:text-purple-800 transition-colors">Szukaj pracy</button>
                <button onClick={() => setMode("search_employers")} className="cursor-pointer hover:text-purple-800 transition-colors">Szukaj pracodawce</button>
                <button onClick={() => setMode("main")} className="cursor-pointer hover:text-purple-800 transition-colors">Panel główny</button>
            </div>

            <div className="flex items-center justify-center gap-6">
                <div onClick={() => setMode("notifications")} className="relative cursor-pointer ">
                    <Bell className="hover:rotate-12 transition-transform duration-300 ease-in-out" />
                    <div className="bg-pink-600 w-3 h-3 rounded-full absolute top-0 -right-0.5"></div>
                </div>

                <div className="bg-purple-800 w-10 h-10 rounded-full"></div>
            </div>
        </div>


    </>)


}
