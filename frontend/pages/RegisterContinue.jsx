import React, { useState, useEffect } from "react";
import { ArrowBigLeft, ArrowBigRight, BriefcaseBusiness, Building2, CircleUser, Phone } from "lucide-react";
import { AboutEmployer, BasicInformation, ContactInformation } from "../src/components/EmployerAccountSetUp";
import { BasicInformationUser, CVUser, ContactInformationUser } from "../src/components/UserAccountSetUp";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../src/api';

export const RegisterSetupWrapper = () => {
    const location = useLocation();
    const role = location.state?.role;

    return role === "Kandydat" ? <RegisterUserContinue /> : <RegisterContinue />;
}

export const RegisterContinue = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        company_name: '',
        short_description: '',
        detailed_description: '',
        work_culture: '',
        company_type: '',
        team_size: '',
        founding_date: null,
        website: '',
        location: '',
        phone_number: '',
        // files
        company_logo: null,
        company_banner: null
    });

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const steps = [
        <BasicInformation formData={formData} updateFormData={updateFormData} />,
        <AboutEmployer formData={formData} updateFormData={updateFormData} />,
        <ContactInformation formData={formData} updateFormData={updateFormData} />
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleFinish = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            // Fetch profile to get ID
            const profilesRes = await api.get('/profiles/');
            const myProfile = profilesRes.data.find(p => p.user === parseInt(userId));

            if (!myProfile) {
                alert("Nie znaleziono profilu użytkownika.");
                return;
            }

            const data = new FormData();
            // Append explicit fields
            if (formData.company_name) data.append('company_name', formData.company_name);
            if (formData.short_description) data.append('short_description', formData.short_description);
            if (formData.detailed_description) data.append('detailed_description', formData.detailed_description);
            if (formData.work_culture) data.append('work_culture', formData.work_culture);
            if (formData.company_type) data.append('company_type', formData.company_type);
            if (formData.team_size) data.append('team_size', formData.team_size);
            if (formData.founding_date) data.append('founding_date', formData.founding_date.toISOString().split('T')[0]);
            if (formData.website) data.append('website', formData.website);
            if (formData.location) data.append('location', formData.location);
            if (formData.phone_number) data.append('phone_number', formData.phone_number);

            if (formData.company_logo) data.append('company_logo', formData.company_logo);
            if (formData.company_banner) data.append('company_banner', formData.company_banner);

            await api.patch(`/profiles/${myProfile.id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            navigate('/empl-dashboard');

        } catch (error) {
            console.error("Setup error:", error);
            alert("Wystąpił błąd podczas zapisywania danych. Spróbuj ponownie.");
        }
    }

    return (
        <div className="bg-white w-screen h-auto overflow-x-hidden py-4 flex items-center justify-center">
            <div className="absolute top-5 left-5 cursor-pointer">
                <div className="flex flex-row items-center justify-center gap-2">
                    <BriefcaseBusiness className="size-8 text-purple-900" />
                    <p className="text-md font-bold">JobBoard</p>
                </div>
            </div>
            <div className="w-7/12 mt-2 h-full">

                <div className="flex items-center justify-center text-[12px] ">
                    <button className={`w-60 gap-1 pb-2 px-2 flex items-center justify-center   text-gray-400  ${currentStep === 0 ? 'text-purple-800 border-b-2 border-purple-800' : 'text-gray-400 border-b-2 border-transparent'}`}><CircleUser strokeWidth={1} /> Podstawowe informacje </button>
                    <button className={`w-60 gap-1 pb-2 px-2 flex items-center justify-center  text-gray-400 ${currentStep === 1 ? 'text-purple-800 border-b-2 border-purple-800' : 'text-gray-400 border-b-2 border-transparent'} `}>< Building2 strokeWidth={1} /> Informacje na temat firmy </button>
                    <button className={`w-60 gap-1 pb-2 px-2 flex items-center justify-center   text-gray-400 ${currentStep === 2 ? 'text-purple-800 border-b-2 border-purple-800' : 'text-gray-400 border-b-2 border-transparent'}`}><Phone strokeWidth={1} /> Indormacje kontaktowe </button>
                </div>
                <div className="border-t border-gray-400 h-0 w-full mb-1"></div>
                <div className="mt-1 mb-7 overflow-hidden rounded-full bg-gray-200">
                    <div className={`h-2 rounded-full bg-purple-800`} style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
                </div>
                <div className="mb-4">
                    {steps[currentStep]}
                </div>

                <div className="border-t border-gray-400 h-0 w-full mt-8"></div>

                <div className="flex items-start gap-4">
                    {currentStep > 0 && (
                        <button
                            onClick={prevStep}
                            className="text-sm w-24 bg-gray-400 mt-4 flex items-center gap-2 justify-center text-white px-3 py-2 rounded-sm font-bold h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
                        >
                            <ArrowBigLeft /> Powrót
                        </button>
                    )}


                    <button
                        onClick={nextStep}
                        className="text-sm w-auto bg-purple-800 mt-4 flex items-center gap-2 justify-center text-white px-3 py-2 rounded-sm font-bold h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
                    >
                        {currentStep === 2 ? 'Zakończ' : 'Dalej'}<ArrowBigRight />
                    </button>
                </div>

            </div>
        </div>
    )

}


export const RegisterUserContinue = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        education: '',
        experience_years: '',
        website: '',
        github_link: '',
        linkedin_link: '',
        nationality: '',
        birth_date: null,
        gender: '',
        marital_status: '', // Not in model directly, maybe append to Bio
        bio: '',
        location: '',
        phone_number: '',
        // files
        profile_picture: null,
        cv: null
    });

    const updateFormData = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const steps = [
        <CVUser formData={formData} updateFormData={updateFormData} />,
        <BasicInformationUser formData={formData} updateFormData={updateFormData} />,
        <ContactInformationUser formData={formData} updateFormData={updateFormData} />
    ];

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    const handleFinish = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            // Fetch profile to get ID
            const profilesRes = await api.get('/profiles/');
            const myProfile = profilesRes.data.find(p => p.user === parseInt(userId));

            if (!myProfile) {
                alert("Nie znaleziono profilu użytkownika.");
                return;
            }

            const data = new FormData();
            if (formData.education) data.append('education', formData.education);
            if (formData.experience_years) data.append('experience_years', formData.experience_years);
            if (formData.website) data.append('website', formData.website);
            if (formData.github_link) data.append('github_link', formData.github_link);
            if (formData.linkedin_link) data.append('linkedin_link', formData.linkedin_link);
            if (formData.nationality) data.append('nationality', formData.nationality);
            if (formData.birth_date) data.append('birth_date', formData.birth_date.toISOString().split('T')[0]);
            if (formData.gender) data.append('gender', formData.gender);

            // Append bio, maybe including marital status
            let fullBio = formData.bio || '';
            if (formData.marital_status) {
                fullBio += `\nStan cywilny: ${formData.marital_status}`;
            }
            if (fullBio) data.append('bio', fullBio);

            if (formData.location) data.append('location', formData.location);
            if (formData.phone_number) data.append('phone_number', formData.phone_number);

            if (formData.profile_picture) data.append('profile_picture', formData.profile_picture);
            if (formData.cv) data.append('cv', formData.cv);

            await api.patch(`/profiles/${myProfile.id}/`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            navigate('/us-dashboard'); // Navigate to user dashboard

        } catch (error) {
            console.error("Setup error:", error);
            alert("Wystąpił błąd podczas zapisywania danych. Spróbuj ponownie.");
        }
    }

    return (
        <div className="bg-white w-screen h-auto overflow-x-hidden py-4 flex items-center justify-center">
            <div className="absolute top-5 left-5 cursor-pointer">
                <div className="flex flex-row items-center justify-center gap-2">
                    <BriefcaseBusiness className="size-8 text-purple-900" />
                    <p className="text-md font-bold">JobBoard</p>
                </div>
            </div>
            <div className="w-7/12 mt-2 h-full">

                <div className="flex items-center justify-center text-[12px]">
                    <button className={`w-60 gap-1 pb-2 flex items-center justify-center   text-gray-400  ${currentStep === 0 ? 'text-purple-800 border-b-2 border-purple-800' : 'text-gray-400 border-b-2 border-transparent'}`}><CircleUser strokeWidth={2} /> CV i zdjęcie </button>
                    <button className={`w-60 gap-1 pb-2  flex items-center justify-center   text-gray-400 ${currentStep === 1 ? 'text-purple-800 border-b-2 border-purple-800' : 'text-gray-400 border-b-2 border-transparent'} `}>< Building2 strokeWidth={2} /> Podstawowe informacje </button>
                    <button className={`w-60 gap-1 pb-2  flex items-center justify-center   text-gray-400 ${currentStep === 2 ? 'text-purple-800 border-b-2 border-purple-800' : 'text-gray-400 border-b-2 border-transparent'}`}><Phone strokeWidth={2} /> Informacje kontaktowe</button>
                </div>
                <div className="border-t border-gray-400 h-0 w-full mb-1"></div>
                <div className="mt-1 mb-7 overflow-hidden rounded-full bg-gray-200">
                    <div className={`h-2 rounded-full bg-purple-800`} style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
                </div>
                <div className="mb-4">
                    {steps[currentStep]}
                </div>

                <div className="border-t border-gray-400 h-0 w-full mt-8"></div>

                <div className="flex items-start gap-4">
                    {currentStep > 0 && (
                        <button
                            onClick={prevStep}
                            className="text-sm w-24 bg-gray-400 mt-4 flex items-center gap-2 justify-center text-white px-3 py-2 rounded-sm font-bold h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
                        >
                            <ArrowBigLeft /> Powrót
                        </button>
                    )}


                    <button
                        onClick={nextStep}
                        className="text-sm w-auto bg-purple-800 mt-4 flex items-center gap-2 justify-center text-white px-3 py-2 rounded-sm font-bold h-auto cursor-pointer hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
                    >
                        {currentStep === 2 ? 'Zakończ' : 'Dalej'}<ArrowBigRight />
                    </button>
                </div>

            </div>
        </div>
    )

}