import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, MapPin, User, Bell } from 'lucide-react';

export const SearchJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get(`/jobs/?q=${query}&sort=newest`);
            setJobs(res.data.results || res.data); // Handle pagination or list
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Szukaj ofert pracy</h2>
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Stanowisko, firma..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <button onClick={fetchJobs} className="bg-purple-800 text-white px-4 py-2 rounded">Szukaj</button>
            </div>
            <div className="grid gap-4">
                {jobs.map(job => (
                    <div key={job.id} className="border p-4 rounded shadow-sm bg-white">
                        <h3 className="font-bold text-lg">{job.title}</h3>
                        <p className="text-gray-600">{job.company_name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                            <MapPin size={16} /> {job.location}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SearchCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            // Need a backend endpoint for searching candidates. Assuming /profiles/ or /users/
            // For now, listing all profiles that are NOT employers.
            const res = await api.get('/profiles/');
            const userProfiles = res.data.filter(p => !p.is_employer);
            setCandidates(userProfiles);
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = candidates.filter(c =>
        (c.bio && c.bio.toLowerCase().includes(query.toLowerCase())) ||
        (c.location && c.location.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Szukaj pracownika</h2>
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Umiejętności, lokalizacja..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(profile => (
                    <div key={profile.id} className="border p-4 rounded shadow-sm bg-white flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 overflow-hidden">
                            {profile.profile_picture ? <img src={profile.profile_picture} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-full h-full p-4 text-gray-400" />}
                        </div>
                        <h3 className="font-bold text-lg">{profile.user_email || "Kandydat"}</h3>
                        <p className="text-sm text-gray-500 mb-2">{profile.location || "Brak lokalizacji"}</p>
                        <p className="text-sm text-gray-600 text-left w-full line-clamp-3" dangerouslySetInnerHTML={{ __html: profile.bio }}></p>
                        <button className="mt-4 bg-purple-100 text-purple-800 px-4 py-2 rounded text-sm font-bold hover:bg-purple-200">Zobacz profil</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const Notifications = () => {
    // Mock notifications for now as backend might not have a full notification system ready
    // Or fetch from /messages/ if we treat messages as notifications
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Twój profil został zaktualizowany.", date: "2024-05-20" },
        { id: 2, text: "Nowa aplikacja na stanowisko Java Developer.", date: "2024-05-19" },
    ]);

    return (
        <div className="p-6 h-full overflow-y-auto w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Bell className="text-purple-800" /> Powiadomienia
            </h2>
            <div className="space-y-4">
                {notifications.map(notif => (
                    <div key={notif.id} className="border-l-4 border-purple-800 bg-white p-4 shadow-sm rounded-r hover:bg-gray-50 transition-colors">
                        <p className="text-gray-800 font-medium">{notif.text}</p>
                        <span className="text-xs text-gray-400 block mt-1">{notif.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
