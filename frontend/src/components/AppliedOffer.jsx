import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "./Badge";
import { Check, MapPin } from "lucide-react";
import { Salary } from "./Salary";


export const AppliedOffer = () => {

    return (<>

        <div className=" flex items-center justify-between flex-row bg-white gap-6 w-full h-20 px-5 border-t border-slate-300">
            <img src="" alt="" className="size-14 rounded-md object-cover" />
            <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-3">
                    <h3 className='text-xl text-slate-800 font-bold'>Title</h3>
                    <Badge />
                </div>
                <div className="flex flex-row items-center gap-3 text-md">
                    <div className="flex flex-row items-center justify-center">
                        <MapPin className="size-4 text-slate-500" />
                        <p className="text-slate-500">City</p>
                    </div>
                    <Salary />
                </div>
            </div>
            <div className="text-slate-500"> 27.10.2025 19:12</div>
            <div className="flex flex-row items-center gap-1 text-md font-bold">
                <Check className="size-5 text-emerald-600" />
                <p className="text-emerald-600">Aktywne</p>
            </div>

            <button className="bg-gray-100 text-purple-800 w-auto px-3 py-3 rounded-sm font-bold h-auto cursor-pointer hover:bg-purple-800 hover:text-gray-100 hover:shadow-lg transition-colors duration-300 ease-in-out">Szczegóły</button>

        </div>


    </>)


}
