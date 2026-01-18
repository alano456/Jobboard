import React, { useState, useEffect } from "react";
import api from "../api";
import { X, Building2, MapPin, Globe, Phone, Users, Calendar } from "lucide-react";

export const EmployersList = () => {
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployer, setSelectedEmployer] = useState(null);

    useEffect(() => {
        const fetchEmployers = async () => {
            try {
                const response = await api.get('/users/');
                const data = response.data.results ? response.data.results : response.data;
                const employerList = Array.isArray(data) ? data.filter(user => user.is_employer || user.profile?.is_employer) : [];
                setEmployers(employerList);
            } catch (error) {
                console.error("Failed to fetch employers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployers();
    }, []);

    return (
        <div className="flex px-10 h-full py-7 flex-col gap-6 min-h-full relative">
            <div className="flex items-center w-full gap-10 justify-between">
                <h1 className="text-2xl text-slate-800 font-extrabold">
                    Pracodawcy
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                {loading ? (
                    <p>Ładowanie...</p>
                ) : employers.length > 0 ? (
                    employers.map((emp) => (
                        <div
                            key={emp.id}
                            onClick={() => setSelectedEmployer(emp)}
                            className="border border-gray-300 p-4 rounded-md bg-white cursor-pointer hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-lg font-bold text-slate-800">{emp.profile?.company_name || emp.username}</h3>
                            <p className="text-gray-500 text-sm mb-2">{emp.email}</p>

                            {emp.profile?.location && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin className="size-3" /> {emp.profile.location}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Brak pracodawców.</p>
                )}
            </div>

            {selectedEmployer && (
                <EmployerDetailsModal
                    employer={selectedEmployer}
                    onClose={() => setSelectedEmployer(null)}
                />
            )}
        </div>
    );
};

const EmployerDetailsModal = ({ employer, onClose }) => {
    const profile = employer.profile || {};

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="size-6 text-gray-500" />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center border border-purple-200">
                            {/* Placeholder or actual logo if available */}
                            <Building2 className="size-10 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{profile.company_name || employer.username}</h2>
                            <p className="text-gray-500">{employer.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {profile.location && (
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2 bg-gray-100 rounded-md"><MapPin className="size-5 text-gray-600" /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold">Lokalizacja</p>
                                    <p>{profile.location}</p>
                                </div>
                            </div>
                        )}
                        {profile.website && (
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2 bg-gray-100 rounded-md"><Globe className="size-5 text-gray-600" /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold">Strona WWW</p>
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">{profile.website}</a>
                                </div>
                            </div>
                        )}
                        {profile.phone_number && (
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2 bg-gray-100 rounded-md"><Phone className="size-5 text-gray-600" /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold">Telefon</p>
                                    <p>{profile.phone_number}</p>
                                </div>
                            </div>
                        )}
                        {profile.founding_date && (
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2 bg-gray-100 rounded-md"><Calendar className="size-5 text-gray-600" /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold">Data założenia</p>
                                    <p>{profile.founding_date}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {profile.description && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">O firmie</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{profile.description}</p>
                        </div>
                    )}

                    {profile.bio && (
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Bio</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                        </div>
                    )}

                </div>
                <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Zamknij</button>
                </div>
            </div>
        </div>
    );
};
