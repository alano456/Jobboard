import React, { useState, useEffect } from "react";
import api from "../api";
import { Offer } from "./Offer";

export const JobsList = ({ onJobSelect }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (query = "") => {
        setLoading(true);
        try {
            const params = query ? { q: query } : {};
            const response = await api.get('/jobs/', { params });
            // Handle pagination or list response
            const data = response.data.results ? response.data.results : response.data;
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(search);
    };

    return (
        <div className="flex px-10 h-full py-7 flex-col gap-6 min-h-full">
            <div className="flex items-center w-full gap-10 justify-between">
                <h1 className="text-2xl text-slate-800 font-extrabold">
                    Oferty pracy
                </h1>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Szukaj ofert..."
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-600"
                    />
                    <button type="submit" className="px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900 transition-colors">
                        Szukaj
                    </button>
                </form>
            </div>

            <div className="flex flex-col flex-1 min-h-0 gap-2 overflow-y-auto">
                {loading ? (
                    <p>Ładowanie ofert...</p>
                ) : jobs.length > 0 ? (
                    jobs.map((job) => (
                        // Assuming Offer component can accept props, otherwise showing basic structure
                        <div key={job.id} className=" flex items-center justify-between flex-row bg-white gap-6 w-full h-20 px-5 border-t border-slate-300">
                            <div className="flex items-center gap-4">
                                <div className="size-14 bg-gray-200 rounded-md flex items-center justify-center font-bold text-gray-400">
                                    IMG
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-row gap-3">
                                        <h3 className='text-xl text-slate-800 font-bold'>{job.title}</h3>
                                    </div>
                                    <div className="flex flex-row items-center gap-3 text-md text-slate-500">
                                        <p>{job.location || "Polska"}</p>
                                        <p>{job.salary_min} - {job.salary_max} PLN</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center flex-row gap-3">
                                <button onClick={() => onJobSelect(job.id)} className="bg-gray-100 text-purple-800 w-auto px-3 py-2 rounded-sm font-bold cursor-pointer hover:bg-purple-800 hover:text-gray-100 transition-colors">
                                    Szczegóły
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Brak ofert spełniających kryteria.</p>
                )}
            </div>
        </div>
    );
};
