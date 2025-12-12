import React from "react";
import { EmployerSidebar } from '../src/components/Sidebar';
import { NavbarEmployer } from '../src/components/Navbar';
import { AllCandidateInOffer, AppliedOffers, MainDashboard } from "../src/components/DashboardsForEmployer";
import { NewJob } from "../src/components/NewJob";
import { useState } from "react";

export const DashboardEmployer = () => {

    const [mode, setMode] = useState("main");

    return (
        <div className="grid grid-cols-[0.2fr_1fr] grid-rows-[4rem_1fr] h-screen w-screen overflow-hidden">
            <div className="col-span-2">
                <NavbarEmployer setMode={setMode} />
            </div>
            <div >
                <EmployerSidebar mode={mode} setMode={setMode} />
            </div>
            <div className="flex flex-col h-full min-h-0">
                {mode === "main" && <MainDashboard />}
                {mode === "newjob" && <NewJob />}
                {mode === "alljob" && <AppliedOffers mode={mode} setMode={setMode} />}
                {mode === "allCandidatesInOffer" && <AllCandidateInOffer />}
            </div>
        </div>
    )
}