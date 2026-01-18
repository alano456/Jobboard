import React, { useState, useEffect } from "react";
import { ArrowBigRight, X } from "lucide-react";
import MyDatePicker from "./DatePicker";
import api from "../api";
import MultiSelect from "./DashboardsForEmployer"; // Importing existing MultiSelect if kept there, or need to verify import
import Editor from "./TextEditor";

// Inline MultiSelect definition if original export is tricky without major refactor, 
// OR simpler: we assume we can import it or replace it. 
// For safety, I'll use a simplified native select for Work Mode to guarantee it works first, 
// then we can upgrade. The original code had a custom MultiSelect.

export const NewJob = () => {

    const [title, setTitle] = useState("")
    const [workMode, setWorkMode] = useState("stacjonarna") // Backend expects string choice usually: 'stacjonarna', 'hybrydowa', 'zdalna'
    const [experience, setExperience] = useState("none")

    // Salary
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [contractType, setContractType] = useState("uop");
    const [location, setLocation] = useState("");

    // Dates (keeping simple text or native date inputs for now to match backend 'YYYY-MM-DD')
    const [startDate, setStartDate] = useState(null); // YYYY-MM-DD
    const [expireDate, setExpireDate] = useState(""); // YYYY-MM-DD

    const [description, setDescription] = useState("")
    const [responsibilities, setResponsibilities] = useState("")
    const [category, setCategory] = useState(''); // Default category (IT) - should fetch from API ideally
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/categories/')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err.response?.data))

    }, []);


    const [showApplied, setShowApplied] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        if (!category || category === 'none') {
            setError("Proszę wybrać kategorię.");
            setLoading(false);
            return;
        }

        setError("");

        // Construct payload matching JobSerializer
        // Fields: title, description, category (ID), salary_min, salary_max, 
        // location (taking from workMode logic or adding field), job_type, experience_required

        const payload = {
            title: title || "",
            description: description || "",
            responsibilities: responsibilities || "",
            category: category && category !== 'none' ? Number(category) : null, // must match model FK
            salary_min: salaryMin ? Number(salaryMin) : null,
            salary_max: salaryMax ? Number(salaryMax) : null,
            start_date: startDate ? new Date(startDate).toISOString().split("T")[0] : null,
            expires_at: expireDate ? new Date(expireDate).toISOString() : null,
            job_type: workMode,       // must match choices key
            experience_required: experience, // must match choices key
            contract_type: contractType,     // must match choices key
            location: location || ""
        };

        try {
            await api.post('/jobs/', payload);
            setShowApplied(true);
            // reset form
            setTitle("");
            setDescription("");
            setSalaryMin("");
            setSalaryMax("");
            setDescription("");
            setResponsibilities("");
            setStartDate(null);
            setExpireDate(null);

        } catch (err) {
            console.error(err);
            const backendErrors = err.response?.data;
            let errorMsg = "Błąd podczas publikowania.";
            if (backendErrors) {
                errorMsg += " " + JSON.stringify(backendErrors);
            } else {
                errorMsg += " Sprawdź dane (np. czy jesteś zalogowany jako pracodawca).";
            }
            setError(errorMsg);
        } finally {
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

    // Removed whole-page error return to keep form visible

    return (
        <div className="flex flex-col px-10 h-full overflow-y-auto items-start justify-start py-7 gap-8 min-h-0 bg-white">
            <div className="flex w-full justify-between items-center">
                <h1 className="text-2xl text-slate-800 font-extrabold">Opublikuj ogłoszenie</h1>
                {error && <p className="text-red-600 font-medium text-sm animate-pulse">{error}</p>}
            </div>


            <div className="flex w-full items-start justify-center flex-col gap-9">
                <h1 className="text-xl text-slate-800 font-extrabold pb-1">Podstawowe informacje</h1>

                <div className="flex w-full items-center justify-center ">
                    <div className="relative w-full text-sm">
                        <span className="absolute left-2 -top-6 text-sm">Nazwa stanowiska</span>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-sm py-3 px-3 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none"
                            placeholder="np. Senior Frontend Developer"
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-5 w-full">
                    <div className="flex flex-1 ">
                        <div className="relative flex-1">
                            <span className="absolute left-2 -top-6 text-sm ">Tryb pracy</span>
                            <select
                                value={workMode}
                                onChange={(e) => setWorkMode(e.target.value)}
                                className="w-full h-12 border border-gray-300 rounded-sm px-2 focus:border-b-2 focus:border-purple-600 outline-none bg-white"
                            >
                                <option value="stacjonarna">Stacjonarna</option>
                                <option value="hybrydowa">Hybrydowa</option>
                                <option value="zdalna">Zdalna</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-1 ">
                        <div className="relative flex-1">
                            <span className="absolute left-2 -top-6 text-sm">Doświadczenie</span>
                            <select
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="w-full h-12 border border-gray-300 rounded-sm px-2 focus:border-b-2 focus:border-purple-600 outline-none bg-white"
                            >
                                <option value="none">Nie wymagane</option>
                                <option value="1-2">1-2 lata</option>
                                <option value="3-5">3-5 lat</option>
                                <option value="5+">5+ lat</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-1 ">
                        <div className="relative flex-1">
                            <span className="absolute left-2 -top-6 text-sm">Kategoria</span>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-12 border border-gray-300 rounded-sm px-2 focus:border-b-2 focus:border-purple-600 outline-none bg-white"
                            >
                                <option value="none">Nie wymagane</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex items-start justify-start w-full gap-9 flex-col">
                <h1 className="text-xl text-slate-800 font-extrabold">Warunki zatrudnienia</h1>
                <div className="flex w-full items-row items-center justify-between gap-5">
                    <div className="relative flex-1">
                        <span className="absolute left-2 -top-6 text-sm">Rodzaj umowy</span>
                        <select
                            value={contractType}
                            onChange={(e) => setContractType(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-sm px-2 focus:border-b-2 focus:border-purple-600 outline-none bg-white"
                        >
                            <option value="uop">Umowa o pracę</option>
                            <option value="b2b">B2B</option>
                            <option value="zlecenie">Umowa Zlecenie</option>
                            <option value="dzielo">Umowa o Dzieło</option>
                            <option value="staz">Staż</option>
                        </select>
                    </div>

                    <div className="flex flex-1 w-full items-center justify-center ">
                        <div className="relative w-full text-sm">
                            <span className="absolute left-2 -top-6 text-sm">Min. (PLN)</span>
                            <input
                                type="number"
                                value={salaryMin}
                                onChange={(e) => setSalaryMin(e.target.value)}
                                className="w-full h-12 border border-gray-300 rounded-sm px-3 focus:border-b-2 focus:border-purple-600 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 w-full items-center justify-center ">
                        <div className="relative w-full text-sm">
                            <span className="absolute left-2 -top-6 text-sm">Max. (PLN)</span>
                            <input
                                type="number"
                                value={salaryMax}
                                onChange={(e) => setSalaryMax(e.target.value)}
                                className="w-full h-12 border border-gray-300 rounded-sm px-3 focus:border-b-2 focus:border-purple-600 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-start justify-start w-full gap-9 flex-col">
                <h1 className="text-xl text-slate-800 pt-2 font-extrabold">Dodatkowe informacje</h1>
                <div className="flex w-full items-row items-center justify-between gap-5">
                    <div className="flex-1">
                        <MyDatePicker text={'Data początkowa'} date={startDate} setDate={setStartDate} />
                    </div>
                    <div className="flex-1">
                        <MyDatePicker text={'Data wygaśnięcia ogłoszenia'} date={expireDate} setDate={setExpireDate} />
                    </div>
                    <div className="relative flex-1 text-sm">
                        <span className="absolute left-2 -top-6 text-sm">Lokalizacja</span>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full h-12 border border-gray-300 rounded-sm px-3 focus:border-b-2 focus:border-purple-600 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-start justify-start w-full gap-3 flex-col">
                <h1 className="text-xl text-slate-800 pt-2 font-extrabold">Opis stanowiska</h1>
                <h1 className="text-sm pl-2 ">Opis</h1>
                <Editor onChange={setDescription} value={description} placeholder="Opisz stanowisko..." />
                <h1 className="text-sm pl-2 pt-2 ">Obowiązki na podanym stanowisku</h1>
                <Editor onChange={setResponsibilities} value={responsibilities} placeholder="Opisz obowiązki..." />
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="text-sm w-auto bg-purple-800 flex items-center gap-2 justify-center text-white px-6 py-4 rounded-sm font-bold h-auto cursor-pointer hover:bg-purple-900 transition-all duration-300 ease-in-out disabled:opacity-70"
            >
                {loading ? "Publikowanie..." : (
                    <>Opóblikuj <ArrowBigRight strokeWidth={1.5} /></>
                )}
            </button>

            {showApplied && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="relative rounded-xl bg-white w-2/5 h-auto px-5 py-6 shadow-2xl">
                        <button onClick={() => setShowApplied(false)} className="absolute bg-gray-200 rounded-full w-10 h-10 -top-4 -right-4 flex items-center justify-center cursor-pointer hover:bg-gray-300">
                            <X className="text-purple-800" strokeWidth={1.5} />
                        </button>
                        <div className="flex items-start justify-center gap-2 flex-col">
                            <h1 className="text-md text-slate-800 font-extrabold">🎉 Gratulacje!</h1>
                            <p className="text-sm text-gray-500">Twoje ogłoszenie zostało opublikowane.</p>
                            <button onClick={() => setShowApplied(false)} className="text-sm text-purple-800 font-bold mt-4 underline">Zamknij</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
