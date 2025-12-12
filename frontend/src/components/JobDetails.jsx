import React, { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Building2, Calendar, Banknote } from "lucide-react";
import api from "../api";

export const JobDetails = ({ jobId, onBack }) => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!jobId) return;
            try {
                const response = await api.get(`/jobs/${jobId}/`);
                setJob(response.data);
            } catch (err) {
                console.error("Error fetching job details:", err);
                setError("Nie udało się pobrać szczegółów oferty.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    if (loading) return <div className="p-10">Ładowanie szczegółów oferty...</div>;
    if (error) return <div className="p-10 text-red-500">{error}</div>;
    if (!job) return <div className="p-10">Oferta nie znaleziona.</div>;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center px-6 py-4 border-b border-gray-200 bg-white">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-purple-800 transition-colors">
                    <ArrowLeft size={20} />
                    Wróć do listy
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-purple-800 to-indigo-900 relative">
                        {/* Placeholder for company banner */}
                    </div>

                    <div className="px-8 pb-8">
                        <div className="flex justify-between items-start -mt-10 mb-6">
                            <div className="bg-white p-1 rounded-lg shadow-md">
                                <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 font-bold text-xl border border-gray-100">
                                    IMG
                                </div>
                            </div>
                            <button onClick={() => alert("Funkcja aplikowania dostępna wkrótce!")} className="mt-12 bg-purple-800 text-white px-8 py-3 rounded-md font-bold hover:bg-purple-900 transition-colors shadow-sm">
                                Aplikuj teraz
                            </button>
                        </div>

                        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">{job.title}</h1>
                        <h2 className="text-xl text-purple-800 font-medium mb-6 flex items-center gap-2">
                            <Building2 size={20} />
                            {job.user?.username || "Firma"}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 border border-gray-100">
                                <MapPin className="text-purple-600" />
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Lokalizacja</p>
                                    <p className="font-medium text-slate-700">{job.location || 'Zdalna'}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 border border-gray-100">
                                <Banknote className="text-green-600" />
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Wynagrodzenie</p>
                                    <p className="font-medium text-slate-700">{job.salary_min} - {job.salary_max} PLN</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 border border-gray-100">
                                <Calendar className="text-blue-600" />
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Typ zatrudnienia</p>
                                    <p className="font-medium text-slate-700">{job.job_type || 'Pełny etat'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none text-slate-600">
                            <h3 className="text-xl font-bold text-slate-800 mb-3">Opis stanowiska</h3>
                            <p className="whitespace-pre-wrap">{job.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
