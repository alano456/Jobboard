import { ArrowBigRight, ArrowDownToLine, Bell, BriefcaseBusiness, ChevronLeft, ChevronRight, Circle, CircleCheckBig, MapPin, Users, UserStar, X, Calendar, Bookmark } from "lucide-react"

import { useState, useRef, useEffect } from "react";
import MyDatePicker from "./DatePicker";
import Editor from "./TextEditor";
import { useActionData } from "react-router-dom";
import api from "../api";


export const MainDashboard = ({ onViewJob }) => {
    const [stats, setStats] = useState({ applied: 0, saved: 0, notifications: 0 });
    const [recentApplications, setRecentApplications] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes, savedRes] = await Promise.all([
                    api.get('/applications/'),
                    api.get('/jobs/saved/')
                ]);

                // Sort applications by date desc for "Recent"
                const sortedApps = Array.isArray(appsRes.data)
                    ? appsRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    : [];

                setStats({
                    applied: Array.isArray(appsRes.data) ? appsRes.data.length : 0,
                    saved: Array.isArray(savedRes.data) ? savedRes.data.length : 0,
                    notifications: 0 // Mock for now
                });
                setRecentApplications(sortedApps.slice(0, 5));
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };
        fetchData();
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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
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
                    <div className="w-5 bg-[#d991c2] h-5 rounded-full animate-bounce"></div>
                    <div className="w-5 h-5 bg-[#9869b8] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-5 h-5 bg-[#6756cc] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="p-10 text-red-600 font-bold">Error: {error}</div>
    }

    return (
        <div className="flex px-10 h-full py-7 flex-col gap-6 min-h-full overflow-y-auto">
            <div className="flex gap-1 items-start flex-col">
                <h1 className="text-2xl text-slate-800 font-extrabold">
                    Witaj, {profileData?.user?.first_name} {profileData?.user?.last_name}
                </h1>
                <p className="text-md text-gray-500">Oto twoje dzienne aktywności</p>
            </div>
            <div className="flex items-center justify-between flex-row gap-5">
                <div className="bg-indigo-100 rounded-md px-4 py-5 flex gap-5 items-center flex-1 justify-between">
                    <div className="flex gap-1 flex-col">
                        <h1 className="text-2xl text-slate-800 font-semibold">{stats.applied}</h1>
                        <p className="text-[14px]">Aplikowane stanowiska</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                        <BriefcaseBusiness className="text-indigo-800" />
                    </div>
                </div>
                <div className="bg-amber-100 rounded-md px-4 py-5 flex gap-5 items-center flex-1 justify-between">
                    <div className="flex gap-1 flex-col">
                        <h1 className="text-2xl text-slate-800 font-semibold">{stats.saved}</h1>
                        <p className="text-[14px]">Zapisane oferty</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                        <UserStar className="text-amber-800" />
                    </div>
                </div>
                <div className="bg-emerald-100 rounded-md px-4 flex-1 py-5 flex gap-5 items-center justify-between">
                    <div className="flex gap-1 flex-col">
                        <h1 className="text-2xl text-slate-800 font-semibold">{stats.notifications}</h1>
                        <p className="text-[14px]">Powiadomienia</p>
                    </div>
                    <div className="bg-white p-4 rounded-sm">
                        <Bell className="text-emerald-700" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <p className="font-bold text-slate-800">Ostatnio aplikowane</p>
                <div className="flex items-center justify-center cursor-pointer group text-gray-500">
                    <p>Zobacz wszystkie <span className="text-2xl inline-block transition-transform duration-300 ease-in-out group-hover:translate-x-1"> →</span></p>
                </div>
            </div>
            <div className="flex flex-col flex-1 min-h-0 gap-2">
                <div className="grid grid-cols-[3fr_2.2fr_2fr_1fr] text-sm px-5 py-2 bg-gray-100 font-bold text-gray-600">
                    <p className="pl-8">OFERTY</p>
                    <p>DATA PRZESŁANIA</p>
                    <p>STATUS</p>
                    <p>AKCJE</p>
                </div>
                <div className="overflow-y-auto flex-1 min-h-0">
                    {recentApplications.map(app => (
                        <Application key={app.id} data={app} onViewJob={onViewJob} />
                    ))}
                    {recentApplications.length === 0 && (
                        <p className="text-center p-10 text-gray-500 italic">Brak ostatnich aplikacji.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export const Application = ({ setMode, data, onViewJob }) => {
    if (!data) return null;
    const { job, created_at, status } = data;

    const formattedDate = new Date(created_at).toLocaleString();
    const salary = job.salary_min ? (job.salary_max ? `${job.salary_min}-${job.salary_max}` : `Od ${job.salary_min}`) : "Do negocjacji";

    return (
        <div className="grid grid-cols-[2.8fr_1fr_2fr_1.4fr] items-center py-4 px-5 border-b border-gray-300">
            <div className="flex gap-3 flex-row">
                <div className="bg-pink-900 rounded-md h-12 w-12">
                    {/* Placeholder for company logo or job image */}
                    {job.image && <img src={job.image} alt="Logo" className="w-full h-full object-cover rounded-md" />}
                </div>
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-2 items-center justify-start">
                        <h1>{job.title}</h1>
                        <span className="text-[14px] bg-purple-50 text-purple-950 rounded-xl px-2 py-1">{job.job_type || 'Zdalna'}</span>
                    </div>
                    <div className="flex items-center justify-start gap-2 text-[14px] text-gray-500">
                        <span className="flex  gap-1"><MapPin className="size-4" /> {job.location || 'Gdańsk'}</span>
                        <span className="bg-gray-500 w-1 h-1 rounded-full"></span>
                        <span>{salary}</span>
                    </div>
                </div>

            </div>

            <div className="flex text-gray-500 items-center justify-center text-sm gap-4">

                <p className="w-40">{formattedDate}</p>
            </div>
            <div className={`flex items-center text-md  text-emerald-700 justify-center gap-2`}>
                <CircleCheckBig className="size-5" />
                <p>{status === 'applied' ? 'Złożona' : status}</p>
            </div>
            <button onClick={() => onViewJob && onViewJob(job.id)} className="text-sm bg-gray-100 mt-2 flex items-center gap-2 justify-center text-purple-900 px-6 py-3 rounded-sm font-bold h-auto cursor-pointer hover:scale-105 hover:shadow-md transition-scale duration-300 ease-in-out">Szczegóły</button>

        </div>
    )
}


export const Applied = ({ mode, setMode, onViewJob }) => {

    const [type, setType] = useState("not");
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        api.get('/applications/')
            .then(res => setApplications(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="flex px-10 h-full py-7 flex-col gap-6 min-h-full">
            <div className="flex items-center w-full gap-10 justify-between ">
                <h1 className="text-2xl text-slate-800 font-extrabold">
                    Wszystkie aplikowane stanowiska
                    <span className="text-gray-500">({applications.length})</span>
                </h1>
                <div className="flex items-center justify-center gap-3">
                    <span className=" text-sm">Satus oferty: </span>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="text-sm px-1 py-1.5 text-gray-500 flex items-center justify-center outline-none rounded-sm h-full cursor-pointer  tracking-wide bg-transparent border border-gray-300  focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer ">
                        <option value="not"
                            className="cursor-pointer text-gray-500 hover:text-white tracking-wide"
                        >...</option>
                        <option value="active"
                            className="cursor-pointer text-gray-500 hover:text-white tracking-wide"
                        >Aktywna</option>
                        <option
                            value="notactive"
                            className="cursor-pointer text-gray-500 hover:text-white tracking-wide"
                        >Wygasła</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col flex-1 min-h-0 gap-2">
                <div className="grid grid-cols-[3fr_2.2fr_2fr_1fr] text-sm px-5 py-1 bg-gray-100">
                    <p className="pl-8">OFERTY</p>
                    <p>DATA PRZESŁANIA</p>
                    <p>STATUS</p>
                    <p>AKCJA</p>
                </div>
                <div className="overflow-y-auto flex-1 min-h-0" >
                    {applications.map(app => (
                        <Application key={app.id} setMode={setMode} data={app} onViewJob={onViewJob} />
                    ))}
                    <Pagination />
                </div>

            </div>
        </div>
    )
}




export const Saved = ({ mode, setMode, onViewJob }) => {

    const [type, setType] = useState("not")
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        api.get('/jobs/saved/')
            .then(res => setSavedJobs(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="flex px-10 h-full py-7 flex-col gap-6 min-h-full">
            <div className="flex items-center w-full gap-10 justify-between ">
                <h1 className="text-2xl text-slate-800 font-extrabold">
                    Zapisane oferty
                    <span className="text-gray-500">({savedJobs.length})</span>
                </h1>
                <div className="flex items-center justify-center gap-3">
                    <span className=" text-sm">Satus oferty: </span>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="text-sm px-1 py-1.5 text-gray-500 flex items-center justify-center outline-none rounded-sm h-full cursor-pointer  tracking-wide bg-transparent border border-gray-300  focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer ">
                        <option value="not"
                            className="cursor-pointer text-gray-500 hover:text-white tracking-wide"
                        >...</option>
                        <option value="active"
                            className="cursor-pointer text-gray-500 hover:text-white tracking-wide"
                        >Aktywna</option>
                        <option
                            value="notactive"
                            className="cursor-pointer text-gray-500 hover:text-white tracking-wide"
                        >Wygasła</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col flex-1 min-h-0 gap-2">
                <div className="overflow-y-auto flex-1 min-h-0" >
                    {savedJobs.map(job => (
                        <SavedApplication key={job.id} setMode={setMode} job={job} onViewJob={onViewJob} />
                    ))}
                    <Pagination />
                </div>

            </div>
        </div>
    )
}



export const SavedApplication = ({ setMode, job, onViewJob }) => {
    if (!job) return null;
    const salary = job.salary_min ? (job.salary_max ? `${job.salary_min}-${job.salary_max}` : `Od ${job.salary_min}`) : "Do negocjacji";

    return (
        <div className="flex items-center justify-between  py-4 px-5 border-b border-gray-300">
            <div className="flex gap-3 flex-row justify-between w-full items-center pr-5">
                <div className="flex items-center justify-center gap-3">
                    <div className="bg-pink-900 rounded-md h-15 w-15">
                        {job.image && <img src={job.image} alt="Logo" className="w-full h-full object-cover rounded-md" />}
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row gap-2 items-center justify-start">
                            <h1>{job.title}</h1>
                            <span className="text-[14px] bg-purple-50 text-purple-950 rounded-xl px-2 py-1">{job.job_type || 'Zdalna'}</span>
                        </div>
                        <div className="flex items-center justify-start gap-2 text-[14px] text-gray-500">
                            <span className="flex  gap-1"><MapPin className="size-4" /> {job.location || 'Polska'}</span>
                            <span className="bg-gray-500 w-1 h-1 rounded-full"></span>
                            <span>{salary}</span>

                            <span className="flex  gap-1 "><Calendar className="size-4" />Wygasa: {new Date(job.expires_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <button className="cursor-pointer hover:scale-105">
                    <Bookmark className="text-amber-400 fill-amber-400" />
                </button>
            </div>
            <button onClick={() => onViewJob && onViewJob(job.id)} className="text-sm bg-purple-800 mt-2 flex items-center gap-2 justify-center text-white px-6 py-3 rounded-sm font-bold h-auto cursor-pointer hover:scale-105 hover:shadow-md transition-scale duration-300 ease-in-out">Aplikuj</button>
        </div>
    )
}




export default function MultiSelect({ options, name, value = [],
    onChange = () => { }, placeholder = "Wybierz opcje..." }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const dropdownRef = useRef();


    const toggleOption = (val) => {
        let newValue;

        if (value.includes(val)) {
            newValue = value.filter((v) => v !== val);
        } else {
            newValue = [...value, val];
        }

        onChange(newValue);
    };


    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
        }
    };


    //document.addEventListener("mousedown", handleClickOutside);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer" ref={dropdownRef}>


            <select name={name} multiple className="hidden" value={value} readOnly>
                {value.map((val) => (
                    <option key={val} value={val}></option>
                ))}
            </select>


            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full py-3 ps-4 pe-9 bg-white border border-gray-300 rounded-lg
                   text-left text-sm cursor-pointer flex items-center gap-2 flex-wrap focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer"
            >
                {value.length === 0 ? (
                    <span className="text-gray-400">{placeholder}</span>
                ) : (
                    value.map((val) => (
                        <span
                            key={val}
                            className="bg-purple-50 text-purple-900 px-2 py-0.5 rounded-md text-xs"
                        >
                            {options.find((o) => o.value === val)?.label}
                        </span>
                    ))
                )}


                <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path d="m7 15 5 5 5-5" />
                    <path d="m7 9 5-5 5 5" />
                </svg>
            </button>


            {open && (
                <div className="absolute mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow z-10">

                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => toggleOption(opt.value)}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                        >
                            <span>{opt.label}</span>

                            {value.includes(opt.value) && (
                                <svg
                                    className="w-4 h-4 text-purple-900"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


export const AllCandidateInOffer = () => {

    return (
        <div className="flex flex-col px-10 py-7 min-h-full ">
            <p className="text-gray-500 text-sm cursor-pointer w-40 pb-2 underline decoration-transparent hover:decoration-current transition-all duration-200">Powrót do ogłoszeń</p>
            <div className="flex flex-row items-center justify-between pb-3 pr-7 border-b border-gray-300">
                <h1 className="text-2xl text-slate-800 font-extrabold ">Kandydaci</h1>
                <div className="flex items-center justify-center gap-4">
                    <button className="cursor-pointer underline decoration-transparent hover:decoration-current transition-all duration-200">Filtruj</button>
                    <button className="cursor-pointer hover:scale-105 bg-purple-800 active:bg-purple-900  text-white px-2 py-1 rounded-sm font-medium h-auto">Sortuj</button>
                </div>
            </div>
            <div className="overflow-y-auto">
                <div className="grid grid-cols-3 auto-rows-max gap-y-5 overflow-y-auto items-start justify-start pt-5 mt-2 rounded-2xl px-5">
                    <CondydateMini />
                    <CondydateMini />
                    <CondydateMini />
                    <CondydateMini />
                    <CondydateMini />
                    <CondydateMini />
                    <CondydateMini />
                    <CondydateMini />
                </div>
                <Pagination />
            </div>

        </div>

    )
}

export const CondydateMini = () => {

    return (
        <div className="flex items-center gap-2 flex-col w-80 border px-6 py-4 border-gray-300 h-auto min-h-40 max-h-80 bg-white rounded-md">
            <div className="w-full flex items-center justify-start gap-2">
                <div className="bg-pink-200 w-10 h-10 rounded-full "></div>
                <div className="flex flex-col items-start justify-center">
                    <h1 className="text-slate-900 text-md font-medium">Imie Nazwisko</h1>
                    <p className="text-gray-500 text-sm">Stanowisko</p>
                </div>
            </div>
            <div className="border-gray-300 border-t w-72 my-2"></div>
            <div className="text-gray-500 text-sm w-full flex gap-2 flex-col">
                <p className="flex flex-row items-center gap-2 "><Circle className="size-2" /> 7 lat doświadczenia</p>
                <p className="flex flex-row items-center gap-2 "><Circle className="size-2" /> Wyksztalcenie: wyższe</p>
                <p className="flex flex-row items-center gap-2 "><Circle className="size-2" /> Wyslano: 07/12/2025</p>
            </div>
            <button
                className="group flex w-full items-center gap-2 text-sm text-purple-900 cursor-pointer mt-2 transition-all duration-200"
            >
                <ArrowDownToLine strokeWidth={1.5} className="size-5" />

                <span className="underline decoration-transparent group-hover:decoration-current transition-all duration-200">
                    Pobierz CV
                </span>
            </button>

        </div>
    )
}

export const Pagination = () => {
    return (
        <div className="flex items-center justify-center my-4 w-full gap-8">
            <button disabled className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-purple-800 hover:border-purple-800 focus:text-white active:border-purple-900 active:text-white active:bg-purplr-900 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
            </button>

            <p className="text-slate-600">
                Strona <strong className="text-slate-800">1</strong> z&nbsp;<strong className="text-slate-800">10</strong>
            </p>

            <button className=" cursor-pointer rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-purple-800 hover:border-purple-800 focus:text-white  active:border-purple-900 active:text-white active:bg-purple-900 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    )
}