import { Calendar } from "lucide-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function MyDatePicker({ text, date, setDate }) {

    return (
        <div className="relative w-full ">
            <span className="absolute left-2 -top-6 text-sm">{text}</span>

            <DatePicker
                selected={date}
                onChange={(d) => setDate(d)}
                placeholderText="Wybierz datę"
                wrapperClassName="w-full"
                dateFormat="dd/MM/yyyy"
                className="text-sm w-full pr-10 px-2 py-3 text-gray-500 outline-none rounded-sm h-full cursor-pointer tracking-wide bg-transparent border border-gray-300 focus:border-purple-600 focus:border-b-2 transition-colors"
            />


            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
    );
}
