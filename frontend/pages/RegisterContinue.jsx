import React from "react";
import { ArrowBigLeft, ArrowBigRight, BrainCircuitIcon, BriefcaseBusiness, Building2, CircleUser, Phone } from "lucide-react";
import { AboutEmployer, BasicInformation, ContactInformation } from "../src/components/EmployerAccountSetUp";
import { useState } from "react";
import { BasicInformationUser, CVUser, ContactInformationUser } from "../src/components/UserAccountSetUp";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const RegisterSetupWrapper = () => {
    const location = useLocation();
    const role = location.state?.role;

    return role === "Kandydat" ? <RegisterUserContinue /> : <RegisterContinue />;
}


export const RegisterContinue = () => {

    const [currentStep, setCurrentStep] = useState(0);

    const [formData, setFormData] = useState({
        companyName: '',
        shortDescription: '',
        detailedDescription: '',
        workCulture: '',
        companyType: '',
        teamSize: '',
        foundingDate: '',

        logo: null,
        logoPreview: null,
        baner: null,
        banerPreview: null,

        location: '',
        phoneNumber: '',
        website: '',
    })

    const updateFormData = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    const steps = [
        <BasicInformation
            key="step1"
            formData={formData}
            updateFormData={updateFormData}
        />,
        <AboutEmployer
            key="step2"
            formData={formData}
            updateFormData={updateFormData}
        />,
        <ContactInformation
            key="step3"
            formData={formData}
            updateFormData={updateFormData}
        />
    ]

    const navigate = useNavigate();

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            updateProfile()
            navigate('/empl-dashboard');
        }
    };

    const updateProfile = async () => {


        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();

            formDataToSend.append('location', formData.location);
            formDataToSend.append('phone_number', formData.phoneNumber);
            formDataToSend.append('website', formData.website);
            formDataToSend.append('company_name', formData.companyName);
            formDataToSend.append('short_description', formData.shortDescription);
            formDataToSend.append('work_culture', formData.workCulture);
            formDataToSend.append('company_type', formData.companyType);
            formDataToSend.append('team_size', formData.teamSize);
            formDataToSend.append('founding_date', formData.foundingDate ? new Date(formData.foundingDate).toISOString().split('T')[0] : '');
            formDataToSend.append('detailed_description', formData.detailedDescription);


            if (formData.logo) {
                formDataToSend.append('company_logo', formData.logo);
            }
            if (formData.baner) {
                formDataToSend.append('company_banner', formData.baner);
            }


            const response = await fetch('http://localhost:8000/api/profiles/',
                {
                    method: 'POST',
                    headers: { 'Authorization': `Token ${token}` },
                    body: formDataToSend
                }
            );

            const result = await response.json();

            if (response.ok) {
                console.log("User data updated", result);
            } else {
                console.log("Error updating profile")
            }

        } catch (error) {
            console.error("Something wenr wrong")
        }

    }

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

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

    const [currentStep, setCurrentStep] = useState(0);

    const [formData, setFormData] = useState({
        nationality: '',
        education: '',
        gender: '',
        expirience: '',
        maritalStatus: '',
        description: '',
        birthday: null,
        web: '',
        github: '',
        linkedin: '',

        photo: null,
        photoPreview: null,
        cv: null,
        cvPreview: null,

        localization: '',
        phone: ''
    })

    const updateFormData = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    const steps = [
        <CVUser
            key="step1"
            formData={formData}
            updateFormData={updateFormData} />,
        <BasicInformationUser
            key="step2"
            formData={formData}
            updateFormData={updateFormData} />,
        <ContactInformationUser
            key="step3"
            formData={formData}
            updateFormData={updateFormData} />
    ];

    const navigate = useNavigate();

    const nextStep = async (e) => {
        e.preventDefault();
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Finish button clicked
            updateProfile()
            navigate('/us-dashboard');
        }
    };

    const updateProfile = async () => {

        try {
            const token = localStorage.getItem('token');
            console.log('Token: ', token);

            const formDataToSend = new FormData();

            const payload = {
                location: formData.localization,
                phone_number: formData.phone,
                website: formData.web,
                education: formData.education,
                experience_years: formData.expirience,
                github_link: formData.github,
                linkedin_link: formData.linkedin,
                nationality: formData.nationality,
                birth_date: formData.birthday ?
                    new Date(formData.birthday).toISOString().split('T')[0] : '',
                gender: formData.gender,
                bio: formData.description
            };

            Object.entries(payload).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    formDataToSend.append(key, value);
                }
            });

            if (formData.photo) {
                formDataToSend.append('profile_picture', formData.photo);
            }
            if (formData.cv) {
                formDataToSend.append('cv', formData.cv);
            }


            const response = await fetch('http://localhost:8000/api/profiles/',
                {
                    method: 'POST',
                    headers: { 'Authorization': `Token ${token}` },
                    body: formDataToSend
                });

            const result = await response.json();

            if (response.ok) {
                console.log("User data updated", result);
            } else {
                console.log("Error updating profile")
            }
        } catch (error) {
            console.error("Something wenr wrong")
        }
    }

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

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