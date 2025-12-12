import React, { useState } from "react";
import { Briefcase, BriefcaseBusiness, Building2 } from 'lucide-react';
import { CreateAccount } from "../src/components/CreateAcoount";
import { SignIn } from "../src/components/SignIn";
import { ResetPassword } from "../src/components/ResetPassword";
import { useNavigate } from "react-router-dom";

export const Register = () => {


    const [mode, setMode] = useState('signin');
    const handleSwitch = (newMode) => {
        setMode(newMode);
    }

    return (

        <>
            <div className="absolute top-5 left-5">
                <div className="cursor-pointer flex flex-row items-center justify-center gap-2">
                    <BriefcaseBusiness className="size-8 text-purple-900" />
                    <p className="text-md font-bold ">JobBoard</p>
                </div>
            </div>
            <div className="bg-white h-screen w-screen flex flex-row overflow-hidden">

                <div className="w-1/2 flex items-center justify-center">
                    {mode === 'signin' && <SignIn onSwitch={handleSwitch} />}
                    {mode === 'signup' && <CreateAccount onSwitch={handleSwitch} />}
                    {mode === 'resetpassword' && <ResetPassword onSwitch={handleSwitch} />}
                </div>
                <div className="w-1/2 relative ">
                    <div className="w-full h-full scale-200 absolute inset-0 bg-gradient-to-t from-black to-purple-800 transform -skew-x-10  origin-top-left translate-x-40"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-10 top-48 left-15">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            Ponad 1,75,324 kandydatów <br /> czeka na oferty pracy
                        </h2>
                        <div className="flex gap-10 mt-10">
                            <div className="flex flex-col items-center">
                                <div className="w-auto h-auto rounded-md p-4 backdrop-blur-md bg-white/10 mb-1">
                                    <BriefcaseBusiness className="size-10" />
                                </div>
                                <span className="text-2xl font-bold">1,75,324</span>
                                <span>Kandydaci</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-auto h-auto rounded-md p-4 backdrop-blur-md bg-white/10 mb-1">
                                    <Building2 className="size-10" />
                                </div>
                                <span className="text-2xl font-bold">97,354</span>
                                <span>Firmy</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-auto h-auto rounded-md p-4 backdrop-blur-md bg-white/10 mb-1">
                                    <Briefcase className="size-10" />
                                </div>
                                <span className="text-2xl font-bold">7,532</span>
                                <span>Oferty pracy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}