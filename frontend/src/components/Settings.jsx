import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Mail, Save, X, Loader2 } from "lucide-react";
import api from "../api";

export const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // First get user details (for ID/Email)
            const userRes = await api.get('/users/me/');
            setUser(userRes.data);

            // Then get profile details by ID
            // Assuming profile ID matches user ID or we can fetch list and filter
            // For simplicity, let's try assuming standard relationship or list
            const profileRes = await api.get('/profiles/');
            const myProfile = profileRes.data.find(p => p.user.id === userRes.data.id);
            if (myProfile) {
                setProfile(myProfile);
            }
        } catch (error) {
            console.error("Failed to load settings data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-purple-600 size-10" /></div>;

    return (
        <div className="flex px-10 h-full py-7 flex-col gap-6 min-h-full overflow-y-auto">
            <div className="flex items-center w-full gap-10 justify-between">
                <h1 className="text-2xl text-slate-800 font-extrabold">
                    Ustawienia
                </h1>
            </div>

            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`pb-2 px-1 text-sm font-medium ${activeTab === 'profile' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Profil i Dane
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`pb-2 px-1 text-sm font-medium ${activeTab === 'security' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Bezpieczeństwo
                </button>
            </div>

            <div className="flex flex-col gap-4 max-w-4xl">
                {activeTab === "profile" && <ProfileSettings user={user} profile={profile} refresh={fetchData} />}
                {activeTab === "security" && <SecuritySettings user={user} />}
            </div>
        </div>
    );
};

const ProfileSettings = ({ user, profile, refresh }) => {
    const [formData, setFormData] = useState({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        bio: profile?.bio || "",
        phone_number: profile?.phone_number || "",
        location: profile?.location || "",
        website: profile?.website || "",
        github_link: profile?.github_link || "",
        linkedin_link: profile?.linkedin_link || "",
        education: profile?.education || "",
        marital_status: profile?.marital_status || ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMsg(null);
        try {
            // Update User (UserViewSet)
            await api.patch('/users/me/', {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email
            });

            // Update Profile (ProfileViewSet)
            if (profile) {
                await api.patch(`/profiles/${profile.id}/`, {
                    bio: formData.bio,
                    phone_number: formData.phone_number,
                    location: formData.location,
                    website: formData.website,
                    github_link: formData.github_link,
                    linkedin_link: formData.linkedin_link,
                    education: formData.education,
                    marital_status: formData.marital_status
                });
            }

            setMsg({ type: 'success', text: 'Zapisano zmiany!' });
            refresh();
        } catch (error) {
            console.error(error);
            setMsg({ type: 'error', text: 'Błąd zapisu. Sprawdź poprawność danych.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-slate-700">Edytuj Profil</h2>

            {msg && (
                <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {msg.text}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Imię</label>
                    <input name="first_name" value={formData.first_name} onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Nazwisko</label>
                    <input name="last_name" value={formData.last_name} onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Adres Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">O mnie (Bio)</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Wykształcenie</label>
                <textarea name="education" value={formData.education} onChange={handleChange} rows="2" className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Stan cywilny</label>
                <input name="marital_status" value={formData.marital_status} onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Telefon</label>
                    <input name="phone_number" value={formData.phone_number} onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Lokalizacja</label>
                    <input name="location" value={formData.location} onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Strona WWW</label>
                <input name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">LinkedIn</label>
                <input name="linkedin_link" value={formData.linkedin_link} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">GitHub</label>
                <input name="github_link" value={formData.github_link} onChange={handleChange} placeholder="https://github.com/..." className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
            </div>

            <button type="submit" disabled={isSaving} className="self-end bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 disabled:opacity-50 flex items-center gap-2">
                {isSaving ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
                Zapisz zmiany
            </button>
        </form>
    )
}

const SecuritySettings = ({ user }) => {
    const [passwordData, setPasswordData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMsg(null);

        if (passwordData.new_password !== passwordData.confirm_password) {
            setMsg({ type: 'error', text: 'Nowe hasła nie są identyczne.' });
            return;
        }

        setLoading(true);
        try {
            await api.post('/users/change_password/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            setMsg({ type: 'success', text: 'Hasło zostało zmienione.' });
            setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
        } catch (error) {
            console.error(error);
            const errorText = error.response?.data?.old_password?.[0] || 'Nie udało się zmienić hasła.';
            setMsg({ type: 'error', text: errorText });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-slate-700">Zmiana Hasła</h2>

            {msg && (
                <div className={`p-3 rounded-md text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4 max-w-md">
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Aktualne hasło</label>
                    <input type="password" name="old_password" value={passwordData.old_password} onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Nowe hasło</label>
                    <input type="password" name="new_password" value={passwordData.new_password} onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Potwierdź nowe hasło</label>
                    <input type="password" name="confirm_password" value={passwordData.confirm_password} onChange={handleChange} className="border border-gray-300 rounded-md p-2 focus:border-purple-500 focus:outline-none" />
                </div>
                <button type="submit" disabled={loading} className="mt-2 bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-900 disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin size-4" /> : <Shield className="size-4" />}
                    Zmień hasło
                </button>
            </form>
        </div>
    )
}
