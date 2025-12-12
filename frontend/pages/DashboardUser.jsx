import React from "react";
import { TestConnection } from '../src/components/TestConnection';
import { JobsList } from '../src/components/JobsList';
import { EmployersList } from '../src/components/EmployersList';
import { Settings } from '../src/components/Settings';
import { JobDetails } from '../src/components/JobDetails';
import { EmployerSidebar, UserSidebar } from '../src/components/Sidebar';
import { NavbarEmployer, NavbarUser } from '../src/components/Navbar';
import { AllCandidateInOffer, MainDashboard, Applied, Saved } from "../src/components/DashboardsForUser";
import { useState } from "react";

export const DashboardUser = () => {

    const [mode, setMode] = useState("main");
    const [selectedJobId, setSelectedJobId] = useState(null);

    const handleJobSelect = (id) => {
        setSelectedJobId(id);
        setMode("job_details");
    };

    return (
        <div className="grid grid-cols-[0.2fr_1fr] grid-rows-[4rem_1fr] h-screen w-screen overflow-hidden">
            <div className="col-span-2">
                <NavbarUser setMode={setMode} />
            </div>
            <div >
                <UserSidebar mode={mode} setMode={setMode} />
            </div>
            <div className="flex flex-col h-full min-h-0">
                {mode === "main" && <MainDashboard />}
                {mode === "search_jobs" && <JobsList onJobSelect={handleJobSelect} />}
                {mode === "search_employers" && <EmployersList />}
                {mode === "aplied" && <Applied mode={mode} setMode={setMode} />}
                {mode === "saved" && <Saved mode={mode} setMode={setMode} />}
                {mode === "messeges" && <AllCandidateInOffer />}
                {mode === "notifications" && <AllCandidateInOffer />}
                {mode === "settings" && <Settings />}
                {mode === "job_details" && <JobDetails jobId={selectedJobId} onBack={() => setMode("search_jobs")} />}
            </div>
        </div>
    )
}