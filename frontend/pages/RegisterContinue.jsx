import React from "react";
import { BrainCircuitIcon, BriefcaseBusiness } from "lucide-react";
import { BasicInformation } from "../src/components/EmployerAccountSetUp";

export const RegisterContinue = () => {

    return (
        <div className="bg-white w-screen h-screen overflow-hidden flex items-center justify-center">
            <div className="absolute top-5 left-5">
                <div className="flex flex-row items-center justify-center gap-2">
                    <BriefcaseBusiness className="size-8 text-purple-900" />
                    <p className="text-md font-bold">JobBoard</p>
                </div>
            </div>
            <div className=""></div>
            <div className="w-7/12">
                <div className=""></div>
                <BasicInformation />
                <button>Click</button>
            </div>
        </div>
    )

}