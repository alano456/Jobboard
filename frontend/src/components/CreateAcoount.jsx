import React from "react";
import { useState } from "react";
import { ArrowBigRight } from 'lucide-react';

export const CreateAccount = ({ onSwitch }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('')
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [role, setRole] = useState('Kandydat');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isEmployer = role === "Kandydat" ? false : true;
        const company_name = "No name"

        const data = {
            username: email,
            name,
            lastname,
            email,
            password1: password,
            password2: repassword,
            isEmployer,
            company_name
        }

        console.log("Data to send:", data);

        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                console.log("User created", result);
            } else {
                console.log("Errors", result.errors);
            }
        } catch (error) {
            console.error("Something went wrong", error);
        }

    }



    return (
        <form className="flex items-center flex-col p-5 w-md" onSubmit={handleSubmit}>
            <div className="flex items-center flex-row justify-between w-full gap-3">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl text-slate-800 font-extrabold">Utwórz konto</h1>
                    <p className="text-slate-800 text-sm">Już posiadasz konto? <span onClick={onSwitch} className="text-purple-800 text-sm font-medium cursor-pointer underline decoration-transparent hover:decoration-current transition-all duration-200">Zaloguj się</span></p>
                </div>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="text-sm px-1 py-1.5 text-slate-400 flex items-center justify-center outline-none rounded-sm h-full cursor-pointer  tracking-wide bg-transparent border-2 border-slate-300  focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer ">
                    <option value="Pracodawca"
                        className="cursor-pointer text-gray-500 hover:text-white tracking-wide"
                    >Pracodawca</option>
                    <option
                        value="Kandydat"
                        className="cursor-pointer text-gray-500 hover:text-white tracking-wide"
                    >Kandydat</option>
                </select>
            </div>

            <div className="flex items-center flex-col justify-between w-full gap-5 pt-7">
                <div className="flex items-center flex-row w-full justify-between gap-3">
                    <div className="flex items-center justify-center w-3/6">
                        <div className="relative text-sm w-full">
                            <input
                                name="username"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder=""
                                className="border-2 w-full border-slate-300 rounded-sm py-1.5  focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                            />
                            <label
                                htmlFor="username"
                                className="absolute  text-slate-400 -top-5 text-sm left-2 cursor-text peer-focus:text-md peer-focus:-top-5 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm"
                            >
                                Imie
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-center w-3/6">
                        <div className="relative text-sm w-full">
                            <input
                                name="userlastname"
                                type="text"
                                placeholder=""
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                className="border-2 w-full border-slate-300 rounded-sm py-1.5  focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                            />
                            <label
                                htmlFor="userlastname"
                                className="absolute  text-slate-400 -top-5 text-sm left-2 cursor-text peer-focus:text-md peer-focus:-top-5 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm"
                            >
                                Nazwisko
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center w-full">
                    <div className="flex items-center justify-center w-full">
                        <div className="relative w-full text-sm">
                            <input
                                name="email"
                                type="email"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-2 border-slate-300 rounded-sm py-1.5   focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-slate-400 -top-5 text-sm left-2 cursor-text peer-focus:text-md peer-focus:-top-5 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-2 peer-placeholder-shown:text-md"
                            >
                                Adres email
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center w-full">
                    <div className="flex items-center justify-center w-full">
                        <div className="relative w-full text-sm">
                            <input
                                name="password"
                                type="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border-2 border-slate-300 rounded-sm py-1.5   focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                            />
                            <label
                                htmlFor="username"
                                className="absolute text-slate-400 -top-5 text-sm left-2 cursor-text peer-focus:text-md peer-focus:-top-5 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-2 peer-placeholder-shown:text-md"
                            >
                                Hasło
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center w-full">
                    <div className="flex w-full items-center justify-center">
                        <div className="w-full relative text-sm">
                            <input
                                name="repassword"
                                type="password"
                                placeholder=""
                                value={repassword}
                                onChange={(e) => setRepassword(e.target.value)}
                                className="w-full border-2 border-slate-300 rounded-sm py-1.5 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                            />
                            <label
                                htmlFor="repassword"
                                className="absolute text-slate-400 -top-5 text-sm left-2 cursor-text peer-focus:text-md peer-focus:-top-5 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-2 peer-placeholder-shown:text-md"
                            >
                                Powtórz hasło
                            </label>
                        </div>
                    </div>
                </div>
                <label htmlFor="" className="flex items-center gap-2 -mt-2">
                    <input type="checkbox"
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-purple-800 focus:ring-purple-800" />
                    <span className="text-slate-800 text-sm">Przeczytałem(am) i akceptuje warunki korzystania z serwisu</span>
                </label>
                <button type="submit" className="text-sm bg-purple-800 mt-2 flex items-center gap-2 justify-center text-white w-full px-3 py-3 rounded-sm font-bold h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-scale duration-300 ease-in-out">Utwórz konto  <ArrowBigRight /></button>
                <div className="w-full">
                    <p className="text-sm flex w-full items-center justify-center text-slate-800">lub</p>
                    <div className="text-sm flex w-full items-center flex-row justify-between gap-2">
                        <button className=" text-sm border-2 w-3/6 py-1.5 border-slate-300 mt-2 flex items-center justify-center text-slate-800  rounded-sm  h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-scale duration-300 ease-in-out">Zaloguj przy pomocy Facebook</button>
                        <button className=" text-sm border-2 w-3/6 py-1.5 border-slate-300 mt-2 flex items-center justify-center text-slate-800  rounded-sm  h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-scale duration-300 ease-in-out">Zaloguj przy pomocy Google</button>
                    </div>
                </div>

            </div>
        </form>
    )
} 