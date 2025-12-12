import React from "react";
import { useState } from "react";
import { ArrowBigRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export const SignIn = ({ onSwitch }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email, // Django defaults to username, but we use email as username in registration often. If username != email, this needs adjustment. 
                    // Assuming for now username=email based on RegisterForm logic "user.username = user.username.lower()" which usually comes from email or specific field. 
                    // Let's try sending 'username': email first as standard DRF behavior.
                    password: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('is_employer', data.is_employer);

                // Redirect based on role
                if (data.is_employer) {
                    navigate('/empl-dashboard'); // Using navigate from react-router-dom instead of window.location for SPA feel
                } else {
                    navigate('/us-dashboard');
                }
            } else {
                setError("Błędny email lub hasło.");
                console.error("Login failed:", data);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Wystąpił błąd logowania. Sprawdź połączenie.");
        }
    }



    return (
        <form className="flex items-center flex-col p-5 w-md" onSubmit={handleSubmit}>
            <div className="flex items-center flex-row justify-between w-full gap-3">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl text-slate-800 font-extrabold">Zaloguj się</h1>
                    {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
                    <p className="text-slate-800 text-sm">Nie posiadasz konta? <span onClick={() => onSwitch("signup")} className="text-purple-800 text-sm font-medium cursor-pointer underline decoration-transparent hover:decoration-current transition-all duration-200">Załóż konto</span></p>
                </div>
            </div>

            <div className="flex items-center flex-col justify-between w-full gap-6 pt-7">
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
                <div className="flex items-center justify-center w-full">
                    <div className="flex items-center justify-center w-full">
                        <div className="relative w-full text-sm">
                            <input
                                name="password"
                                type="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-sm py-1.5   focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                            />
                            <label
                                htmlFor="username"
                                className="absolute text-gray-400 -top-5 text-sm left-2 cursor-text peer-focus:text-md peer-focus:-top-5 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-2 peer-placeholder-shown:text-md"
                            >
                                Hasło
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                    <label htmlFor="" className="flex items-center gap-2 -mt-2">
                        <input type="checkbox"
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-purple-800 focus:ring-purple-800" />
                        <span className="text-slate-800 text-sm">Zapamiętaj mnie</span>
                    </label>
                    <span onClick={() => onSwitch("resetpassword")} className="text-purple-800 text-sm font-medium cursor-pointer underline decoration-transparent hover:decoration-current transition-all duration-200">Zapomniano hasła</span>
                </div>

                <button type="submit" className="text-sm bg-purple-800 mt-2 flex items-center gap-2 justify-center text-white w-full px-3 py-3 rounded-sm font-bold h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-scale duration-300 ease-in-out">Zaloguj  <ArrowBigRight /></button>
                <div className="w-full">
                    <p className="text-sm flex w-full items-center justify-center text-slate-800">lub</p>
                    <div className="text-sm flex w-full items-center flex-row justify-between gap-2">
                        <button className=" text-sm border w-3/6 py-1.5 border-gray-300 mt-2 flex items-center justify-center text-slate-800  rounded-sm  h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-scale duration-300 ease-in-out">Zaloguj przy pomocy Facebook</button>
                        <button className=" text-sm border w-3/6 py-1.5 border-gray-300 mt-2 flex items-center justify-center text-slate-800  rounded-sm  h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-scale duration-300 ease-in-out">Zaloguj przy pomocy Google</button>
                    </div>
                </div>

                <div className="w-full pt-4 border-t border-gray-200 mt-4">
                    <p className="text-xs text-center text-gray-500 mb-2">Szybki dostęp (Tryb Developerski)</p>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => window.location.href = '/empl-dashboard'} className="w-1/2 bg-indigo-100 text-indigo-800 py-2 rounded-sm text-xs font-bold hover:bg-indigo-200">Panel Pracodawcy</button>
                        <button type="button" onClick={() => window.location.href = '/us-dashboard'} className="w-1/2 bg-green-100 text-green-800 py-2 rounded-sm text-xs font-bold hover:bg-green-200">Panel Kandydata</button>
                    </div>
                </div>

            </div>
        </form>
    )
} 