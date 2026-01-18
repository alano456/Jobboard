import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, MapPin, User, Bell, Mail, Github, Linkedin, ExternalLink, FileText, Phone, Calendar, X, Briefcase, Heart } from 'lucide-react';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [query, setQuery] = useState('');
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const res = await api.get('/profiles/');
            setCandidates(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleSave = async (profileId) => {
        try {
            const res = await api.post(`/profiles/${profileId}/toggle_save/`);
            // Update local state
            setCandidates(prev => prev.map(c =>
                c.id === profileId ? { ...c, is_saved: res.data.status === 'added' } : c
            ));
            if (selectedProfile && selectedProfile.id === profileId) {
                setSelectedProfile(prev => ({ ...prev, is_saved: res.data.status === 'added' }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearch = () => {
        setQuery(searchTerm);
    };

    const filtered = candidates.filter(c => {
        if (!query) return true;
        const q = query.toLowerCase();
        const firstName = c.user?.first_name?.toLowerCase() || "";
        const lastName = c.user?.last_name?.toLowerCase() || "";
        const email = c.user?.email?.toLowerCase() || "";
        const bio = c.bio?.toLowerCase() || "";
        const location = c.location?.toLowerCase() || "";

        return firstName.includes(q) ||
            lastName.includes(q) ||
            email.includes(q) ||
            bio.includes(q) ||
            location.includes(q);
    });

    return (
        <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Szukaj pracownika</h2>
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Imię, nazwisko, umiejętności, lokalizacja..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                />
                <button
                    onClick={handleSearch}
                    className="bg-purple-800 text-white px-6 py-2 rounded font-bold hover:bg-purple-900 transition-colors shadow-md flex items-center gap-2"
                >
                    <Search size={18} /> Szukaj
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length > 0 ? (
                    filtered.map(profile => (
                        <div key={profile.id} className="border p-4 rounded shadow-sm bg-white flex flex-col items-center text-center relative group">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleSave(profile.id); }}
                                className="absolute right-3 top-3 p-1.5 rounded-full bg-slate-50 hover:bg-red-50 transition-colors z-10"
                            >
                                <Heart
                                    size={18}
                                    className={`${profile.is_saved ? 'fill-red-500 text-red-500' : 'text-gray-300'} transition-all`}
                                />
                            </button>
                            <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 overflow-hidden">
                                {profile.profile_picture ? <img src={profile.profile_picture} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-full h-full p-4 text-gray-400" />}
                            </div>
                            <h3 className="font-bold text-lg">
                                {profile.user.first_name} {profile.user.last_name}
                            </h3>
                            <p className="text-sm text-gray-400 mb-1">{profile.user.email}</p>
                            <p className="text-sm text-gray-500 mb-2">{profile.location || "Brak lokalizacji"}</p>
                            {profile.bio ? (
                                <p className="text-sm text-gray-600 text-left w-full line-clamp-3" dangerouslySetInnerHTML={{ __html: profile.bio }}></p>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Brak opisu kandydata.</p>
                            )}
                            <button
                                onClick={() => setSelectedProfile(profile)}
                                className="mt-4 bg-purple-100 text-purple-800 px-4 py-2 rounded text-sm font-bold hover:bg-purple-200 transition-colors"
                            >
                                Zobacz profil
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 font-medium">Brak kandydatów spełniających wybrane kryteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setQuery(''); }}
                            className="mt-2 text-purple-800 text-sm font-bold hover:underline"
                        >
                            Wyczyść filtry
                        </button>
                    </div>
                )}
            </div>

            {selectedProfile && (
                <CandidateModal
                    profile={selectedProfile}
                    onClose={() => setSelectedProfile(null)}
                    onToggleSave={() => toggleSave(selectedProfile.id)}
                />
            )}
        </div>
    );
};

const CandidateModal = ({ profile, onClose, onToggleSave }) => {
    const handleDownloadCV = () => {
        if (profile.cv) {
            window.open(`http://localhost:8000${profile.cv}`, '_blank');
        } else {
            alert("Kandydat nie załączył CV.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-purple-800 to-indigo-900">
                    <div className="absolute right-4 top-4 flex gap-2 z-10">
                        <button
                            onClick={onToggleSave}
                            className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
                        >
                            <Heart size={20} className={profile.is_saved ? "fill-red-500 text-red-500" : ""} />
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="absolute -bottom-12 left-8 border-4 border-white rounded-full overflow-hidden w-24 h-24 bg-gray-100 shadow-lg">
                        {profile.profile_picture ? (
                            <img src={`http://localhost:8000${profile.profile_picture}`} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-full h-full p-6 text-gray-400" />
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 pt-16 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex-1">
                            <h2 className="text-3xl font-extrabold text-slate-900">
                                {profile.user.first_name} {profile.user.last_name || profile.user.username}
                            </h2>
                            <p className="text-lg text-purple-800 font-medium mt-1">
                                {profile.experience_years || 0} lat doświadczenia
                            </p>

                            <div className="flex flex-wrap gap-4 mt-4">
                                {profile.location && (
                                    <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                                        <MapPin size={16} className="text-purple-600" />
                                        {profile.location}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                                    <Mail size={16} className="text-purple-600" />
                                    {profile.user.email}
                                </div>
                                {profile.phone_number && (
                                    <div className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                                        <Phone size={16} className="text-purple-600" />
                                        {profile.phone_number}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            <button
                                onClick={handleDownloadCV}
                                className="bg-purple-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-900 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                <FileText size={18} /> Zobacz CV
                            </button>
                            <div className="flex gap-2">
                                {profile.linkedin_link && (
                                    <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-50 text-blue-700 p-3 rounded-xl hover:bg-blue-100 transition-colors flex justify-center shadow-sm">
                                        <Linkedin size={20} />
                                    </a>
                                )}
                                {profile.github_link && (
                                    <a href={profile.github_link} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 text-gray-900 p-3 rounded-xl hover:bg-gray-200 transition-colors flex justify-center shadow-sm">
                                        <Github size={20} />
                                    </a>
                                )}
                                {profile.website && (
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex-1 bg-purple-50 text-purple-700 p-3 rounded-xl hover:bg-purple-100 transition-colors flex justify-center shadow-sm">
                                        <ExternalLink size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Briefcase size={20} className="text-purple-800" /> O sobie
                                </h3>
                                {profile.bio ? (
                                    <div className="text-gray-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100" dangerouslySetInnerHTML={{ __html: profile.bio }} />
                                ) : (
                                    <p className="text-gray-400 italic">Brak dodatkowego opisu.</p>
                                )}
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Calendar size={20} className="text-purple-800" /> Edukacja
                                </h3>
                                {profile.education ? (
                                    <p className="text-gray-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{profile.education}</p>
                                ) : (
                                    <p className="text-gray-400 italic">Brak informacji o wykształceniu.</p>
                                )}
                            </section> {/* section */}
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-wider">Szczegóły</h4>
                                <div className="space-y-4">
                                    <DetailItem label="Narodowość" value={profile.nationality} />
                                    <DetailItem label="Data urodzenia" value={profile.birth_date} />
                                    <DetailItem label="Płeć" value={profile.gender === 'M' ? 'Mężczyzna' : profile.gender === 'K' ? 'Kobieta' : 'Inna'} />
                                    <DetailItem label="Stan cywilny" value={profile.marital_status} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div>
        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-medium text-slate-700">{value || "—"}</span>
    </div>
);

export const SavedCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        fetchSavedCandidates();
    }, []);

    const fetchSavedCandidates = async () => {
        try {
            const res = await api.get('/profiles/saved/');
            setCandidates(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const toggleSave = async (profileId) => {
        try {
            const res = await api.post(`/profiles/${profileId}/toggle_save/`);
            if (res.data.status === 'removed') {
                setCandidates(prev => prev.filter(c => c.id !== profileId));
                if (selectedProfile && selectedProfile.id === profileId) {
                    setSelectedProfile(null);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-10 text-center text-purple-800 font-medium">Ładowanie zapisanych kandydatów...</div>;

    return (
        <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
                <Heart className="text-red-500 fill-red-500" />
                <h2 className="text-2xl font-bold">Zapisani kandydaci</h2>
            </div>

            {candidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map(profile => (
                        <div key={profile.id} className="border p-4 rounded-xl shadow-sm bg-white flex flex-col items-center text-center relative group hover:shadow-md transition-shadow">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleSave(profile.id); }}
                                className="absolute right-3 top-3 p-1.5 rounded-full bg-red-50 hover:bg-red-100 transition-colors z-10"
                                title="Usuń z zapisanych"
                            >
                                <Heart size={18} className="fill-red-500 text-red-500" />
                            </button>
                            <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 overflow-hidden border-2 border-purple-100">
                                {profile.profile_picture ? (
                                    <img src={`http://localhost:8000${profile.profile_picture}`} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-full h-full p-4 text-gray-400" />
                                )}
                            </div>
                            <h3 className="font-bold text-lg text-slate-800">
                                {profile.user.first_name} {profile.user.last_name}
                            </h3>
                            <p className="text-sm text-gray-400 mb-1">{profile.user.email}</p>
                            <p className="text-sm text-gray-500 mb-2 flex items-center gap-1 justify-center">
                                <MapPin size={14} className="text-purple-600" /> {profile.location || "Brak lokalizacji"}
                            </p>

                            <div className="mt-auto pt-4 w-full">
                                <button
                                    onClick={() => setSelectedProfile(profile)}
                                    className="w-full bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-200 transition-colors"
                                >
                                    Zobacz profil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-100 shadow-sm">
                    <div className="bg-gray-50 p-6 rounded-full mb-4">
                        <Heart size={48} className="text-gray-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">Nie masz jeszcze zapisanych kandydatów</h3>
                    <p className="text-gray-500 mt-2 text-center max-w-xs">
                        Dodaj interesujących kandydataów do ulubionych, aby mieć do nich szybki dostęp.
                    </p>
                </div>
            )}

            {selectedProfile && (
                <CandidateModal
                    profile={selectedProfile}
                    onClose={() => setSelectedProfile(null)}
                    onToggleSave={() => toggleSave(selectedProfile.id)}
                />
            )}
        </div>
    );
};

export const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/');
            setNotifications(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Ładowanie powiadomień...</div>;

    return (
        <div className="p-6 h-full overflow-y-auto w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Bell className="text-purple-800" /> Powiadomienia
            </h2>
            <div className="space-y-4">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div key={notif.id} className={`border-l-4 border-purple-800 p-4 shadow-sm rounded-r hover:bg-gray-50 transition-colors ${notif.is_read ? 'bg-white opacity-70' : 'bg-purple-50'}`}>
                            <p className="text-gray-800 font-medium">{notif.message}</p>
                            <span className="text-xs text-gray-400 block mt-1">{new Date(notif.created_at).toLocaleString()}</span>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 bg-white rounded shadow-sm">
                        Brak nowych powiadomień.
                    </div>
                )}
            </div>
        </div>
    );
};
