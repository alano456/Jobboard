import React from "react";
import { TestConnection } from '../src/components/TestConnection';
import { JobsList } from '../src/components/JobsList';
import { EmployersList } from '../src/components/EmployersList';
import { Settings } from '../src/components/Settings';
import { JobDetails } from '../src/components/JobDetails';
import { EmployerSidebar, UserSidebar } from '../src/components/Sidebar';
import { NavbarEmployer, NavbarUser } from '../src/components/Navbar';
import { AllCandidateInOffer, MainDashboard, Applied, Saved } from "../src/components/DashboardsForUser";
import { useState, useEffect } from "react";

export const DashboardUser = () => {

    const [mode, setMode] = useState("main");
    const [selectedJobId, setSelectedJobId] = useState(null);

    const token = localStorage.getItem('token');
    console.log('Token: ', token);

    const handleJobSelect = (id) => {
        setSelectedJobId(id);
        setMode("job_details");
    };

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {

            const token = localStorage.getItem('token');

            if (!token) {
                setError("No token found");
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:8000/api/profiles/', {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Profile: ", data);

            setProfileData(data);
            setLoading(false);

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-screen h-screen bg-white relative flex justify-center items-center">
                <div className="flex gap-x-2">
                    <div
                        className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce"
                    ></div>
                    <div
                        className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce"
                    ></div>
                    <div
                        className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce"
                    ></div>
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="">Error : {error}</div>
    }

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