import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Mail, Save, X, Loader2 } from "lucide-react";
import api from "../api";

export const Settings = ({ refreshProfile }) => {
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
            // Get user details
            const userRes = await api.get('/users/me/');
            setUser(userRes.data);

            // Get profile details - using the new 'me' endpoint
            const profileRes = await api.get('/profiles/me/');
            setProfile(profileRes.data);
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
                {activeTab === "profile" && <ProfileSettings user={user} profile={profile} refresh={fetchData} refreshProfile={refreshProfile} />}
                {activeTab === "security" && <SecuritySettings user={user} />}
            </div>
        </div>
    );
};

const ProfileSettings = ({ user, profile, refresh, refreshProfile }) => {
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

    const getFullImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `http://127.0.0.1:8000${path}`;
    };

    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(getFullImageUrl(profile?.profile_picture));

    useEffect(() => {
        setFormData({
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
        setPreviewUrl(getFullImageUrl(profile?.profile_picture));
    }, [user, profile]);

    const [isSaving, setIsSaving] = useState(false);
    const [msg, setMsg] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
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
                const profileData = new FormData();
                profileData.append("bio", formData.bio);
                profileData.append("phone_number", formData.phone_number);
                profileData.append("location", formData.location);
                profileData.append("website", formData.website);
                profileData.append("github_link", formData.github_link);
                profileData.append("linkedin_link", formData.linkedin_link);
                profileData.append("education", formData.education);
                profileData.append("marital_status", formData.marital_status);

                if (profilePicture) {
                    profileData.append("profile_picture", profilePicture);
                }

                await api.patch('/profiles/me/', profileData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }

            setMsg({ type: 'success', text: 'Zapisano zmiany!' });
            refresh();
            if (refreshProfile) refreshProfile();
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

            <div className="flex items-center gap-6">
                <div className="relative size-24 rounded-full overflow-hidden border border-gray-200">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <User className="size-10" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 cursor-pointer bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                        Wybierz zdjęcie
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-500">JPG, PNG max 2MB</p>
                </div>
            </div>


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
