import React, { useState, useEffect } from "react";
import api from "../api";

export const EmployersList = () => {
    const [employers, setEmployers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployers = async () => {
            try {
                // Fetch users who are employers
                // Assuming /api/users/ or similar endpoint exists and filters could be applied
                // For now fetching all users and filtering client side if needed, or using a specific endpoint if available
                const response = await api.get('/users/');
                const data = response.data.results ? response.data.results : response.data;
                // Filter for employers using new root field or fallback
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
        <div className="flex px-10 h-full py-7 flex-col gap-6 min-h-full">
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
                        <div key={emp.id} className="border border-gray-300 p-4 rounded-md bg-white">
                            <h3 className="text-lg font-bold text-slate-800">{emp.username}</h3>
                            <p className="text-gray-500">{emp.email}</p>
                            {/* Display company name from root or profile */}
                            {(emp.company_name || emp.profile?.company_name) && (
                                <p className="font-medium text-purple-800">{emp.company_name || emp.profile?.company_name}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Brak pracodawców.</p>
                )}
            </div>
        </div>
    );
};
