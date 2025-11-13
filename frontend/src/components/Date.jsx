import { Calendar } from "lucide-react";
import React from "react";

export const DateOffer = (str) => {

    return (
        <div className="flex flex-row items-center justify-center gap-1">
            <Calendar className="size-4 text-slate-500" />
            <p className="text-slate-500">Pozostało 10 dni</p>
        </div>

    )
}