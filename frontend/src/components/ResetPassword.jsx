import { ArrowBigRight } from "lucide-react";
import React from "react";
import { useState } from "react";

export const ResetPassword = ({ onSwitch }) => {

    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <form className="flex items-center flex-col p-5 w-md" onSubmit={handleSubmit}>
            <div className="flex items-center flex-row justify-between w-full gap-3">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl text-slate-800 font-extrabold">Zapomniano hasła</h1>
                    <p className="text-slate-800 text-sm">Nie posiadasz konta? <span onClick={() => onSwitch("signup")} className="text-purple-800 text-sm font-medium cursor-pointer underline decoration-transparent hover:decoration-current transition-all duration-200">Załóż konto</span></p>
                    <p className="text-slate-800 text-sm">Posiadasz konto? <span onClick={() => onSwitch("sign in")} className="text-purple-800 text-sm font-medium cursor-pointer underline decoration-transparent hover:decoration-current transition-all duration-200">Załoguj się</span></p>
                </div>
            </div>

            <div className="flex items-center flex-col justify-between w-full gap-5 pt-7">
                <div className="flex items-center justify-center w-full">
                    <div className="flex items-center justify-center w-full">
                        <div className="relative w-full text-sm">
                            <input
                                name="email"
                                type="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-sm py-1.5   focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-gray-400 -top-5 text-sm left-2 cursor-text peer-focus:text-md peer-focus:-top-5 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-2 peer-placeholder-shown:text-md"
                            >
                                Adres email
                            </label>
                        </div>
                    </div>
                </div>

                <button type="submit" className="text-sm bg-purple-800 mt-2 flex items-center gap-2 justify-center text-white w-full px-3 py-3 rounded-sm font-bold h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-scale duration-300 ease-in-out">Resetuj hasło <ArrowBigRight /></button>
                <div className="w-full">
                    <p className="text-sm flex w-full items-center justify-center text-slate-800">lub</p>
                    <div className="text-sm flex w-full items-center flex-row justify-between gap-2">
                        <button className=" text-sm border w-3/6 py-1.5 border-gray-300 mt-2 flex items-center justify-center text-slate-800  rounded-sm  h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-scale duration-300 ease-in-out">Zaloguj przy pomocy Facebook</button>
                        <button className=" text-sm border w-3/6 py-1.5 border-gray-300 mt-2 flex items-center justify-center text-slate-800  rounded-sm  h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-scale duration-300 ease-in-out">Zaloguj przy pomocy Google</button>
                    </div>
                </div>

            </div>
        </form>
    )

}