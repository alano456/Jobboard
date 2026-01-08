import React, { useState } from "react";
import Editor from "./TextEditor";
import MyDatePicker from "./DatePicker";
import { Link, Mail, MapPin } from "lucide-react";

export const BasicInformation = ({ formData, updateFormData }) => {

    const [logoPreview, setLogoPreview] = useState(null);
    const [banerPreview, setBanerPreview] = useState(null);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        updateFormData('company_logo', file);

        const reader = new FileReader();
        reader.onload = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
    }

    const handleBanerUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        updateFormData('company_banner', file);

        const reader = new FileReader();
        reader.onload = () => setBanerPreview(reader.result);
        reader.readAsDataURL(file);
    }

    return (
        <div className="flex items-center justify-center gap-5 flex-col">
            <div className="w-full flex items-start justify-center flex-col ">
                <h1 className="text-md text-slate-800 font-extrabold">Prześlij Logo i Baner firmy</h1>
                <div className="flex items-stretch justify-between w-full gap-2">
                    <div className="flex w-1/4 items-center justify-center aspect-square">
                        <label htmlFor="dropzone-file" className="flex text-center flex-col h-4/5 items-center justify-center px-3 w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            {!logoPreview && !formData?.company_logo_url ? (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 "><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 ">SVG, PNG , JPEG or JPG  (MAX. 800x400px)</p>
                                </div>
                            ) : (
                                <img src={logoPreview || formData?.company_logo_url} alt="Logo" className="w-full h-4/5 object-contain" />
                            )}
                            <input id="dropzone-file" type="file" accept="image/jpeg, image/png, image/svg, image/jpg" onChange={handleLogoUpload} className="hidden" />
                        </label>
                    </div>

                    <div className="flex-1 flex items-center">
                        <label htmlFor="dropzone-baner" className="flex text-center flex-col  items-center justify-center px-3 w-full h-4/5 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            {!banerPreview && !formData?.company_banner_url ? (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 "><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 "> SVG, PNG, JPEG  or JPG (MAX. 800x400px)</p>
                                </div>
                            ) : (
                                <img src={banerPreview || formData?.company_banner_url} alt="Baner" className="w-full h-4/5 object-contain" />
                            )}
                            <input id="dropzone-baner" type="file" accept="image/jpeg, image/png, image/svg, image/jpg" onChange={handleBanerUpload} className="hidden" />
                        </label>
                    </div>
                </div>
            </div>
            <div className="flex items-stretch justify-start w-full flex-col -mt-4">
                <h1 className="text-md text-slate-800 font-extrabold pb-3">Informcja o firmie</h1>
                <div className="flex items-center justify-center w-full">
                    <div className="relative w-full text-sm mt-5">
                        <h1 className="text-sm  absolute pb-2 left-2 -top-6">Nazwa firmy</h1>
                        <input
                            name="company_name"
                            type="text"
                            placeholder=""
                            value={formData.company_name || ""}
                            onChange={(e) => updateFormData('company_name', e.target.value)}
                            className="w-full border border-gray-300 rounded-sm py-3   focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full relative mt-3">
                <h1 className="text-sm absolute pb-2 left-2 -top-6">O nas (Krótki opis)</h1>
                <Editor
                    setDescription={(val) => updateFormData('short_description', val)}
                    text={'Podaj krótki opis swojej firmy'}
                />
            </div>
        </div>
    )
}

export const AboutEmployer = ({ formData, updateFormData }) => {

    return (
        <div className="pt-5 flex flex-col gap-10">
            <div className="flex items-center justify-between flex-row gap-3">
                <div className="relative" style={{ width: "32%" }}>
                    <span className="absolute left-2 -top-6 text-sm">Rodzaj firmy</span>
                    <select
                        value={formData.company_type || ""}
                        onChange={(e) => updateFormData('company_type', e.target.value)}
                        className="text-sm px-2 py-3 w-full  text-gray-500 flex items-center justify-center outline-none rounded-sm h-full cursor-pointer  tracking-wide bg-transparent border border-gray-300  focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer "
                    >
                        <option value="">Wybierz</option>
                        <option value="Software House">Software House</option>
                        <option value="Firma produktowa">Firma produktowa</option>
                        <option value="Korporacja IT">Korporacja IT</option>
                        <option value="Konsulting IT">Konsulting IT</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="GameDev">GameDev</option>
                    </select>
                </div>

                <div className="relative" style={{ width: "32%" }}>
                    <span className="absolute left-2 -top-6 text-sm">Rozmiar zespołu</span>
                    <select
                        value={formData.team_size || ""}
                        onChange={(e) => updateFormData('team_size', e.target.value)}
                        className="text-sm  w-full px-2 py-3 text-gray-500 flex items-center justify-center outline-none rounded-sm h-full cursor-pointer tracking-wide bg-transparent border border-gray-300  focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer "
                    >
                        <option value="">Wybierz</option>
                        <option value="1-10 osób">1-10 osób</option>
                        <option value="10-50 osób">10-50 osób</option>
                        <option value="50-100 osób">50-100 osób</option>
                        <option value="100-500 osób">100-500 osób</option>
                        <option value="500-1000 osób">500-1000 osób</option>
                        <option value="1000+ osób">1000+ osób</option>
                    </select>
                </div>

                <div style={{ width: "32%" }}>
                    <MyDatePicker
                        date={formData.founding_date ? new Date(formData.founding_date) : null}
                        setDate={(date) => updateFormData('founding_date', date)}
                        text={'Data utworzenia'}
                    />
                </div>
            </div>

            <div className="flex items-center justify-center w-full ">
                <div className="relative w-full text-sm">
                    <span className="absolute left-2 -top-6 text-sm">Strona internetowa</span>
                    <input
                        name="website"
                        type="text"
                        placeholder=""
                        value={formData.website || ""}
                        onChange={(e) => updateFormData('website', e.target.value)}
                        className="w-full border border-gray-300 rounded-sm py-3 pl-10 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                    />
                    <Link className="absolute left-2 top-3 text-purple-800" />
                </div>
            </div>

            <div className="w-full relative ">
                <h1 className="text-sm absolute pb-2 left-2 -top-6">O firmie</h1>
                <Editor
                    setDescription={(val) => updateFormData('detailed_description', val)}
                    text={'Opisz czym zajmuke się twoja firma'}
                />
            </div>

            <div className="w-full relative">
                <h1 className="text-sm pb-2 absolute left-2 -top-6">O prace</h1>
                <Editor
                    setDescription={(val) => updateFormData('work_culture', val)}
                    text={'Opisz jak wygląda praca w twojej firmie'}
                />
            </div>
        </div>
    )
}

export const ContactInformation = ({ formData, updateFormData }) => {

    return (
        <div className="pt-5 flex flex-col gap-10 ">
            <div className="flex items-center justify-center w-full ">
                <div className="relative w-full text-sm">
                    <span className="absolute left-2 -top-6 text-sm">Lokalizacja</span>
                    <input
                        name="location"
                        type="text"
                        placeholder=""
                        value={formData.location || ""}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        className="w-full border border-gray-300 top-2 rounded-sm py-3 pl-10 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                    />
                    <MapPin className="absolute left-2 top-3 text-purple-800" />
                </div>
            </div>
            <div className="flex items-center justify-center w-full ">
                <div className="relative w-full text-sm">
                    <span className="absolute left-2 -top-6 text-sm">Numer telefonu</span>
                    <input
                        name="phone_number"
                        type="tel"
                        placeholder=""
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={formData.phone_number || ""}
                        onChange={(e) => updateFormData('phone_number', e.target.value)}
                        className="w-full border border-gray-300 rounded-sm py-3 pl-15 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                    />
                    <span className="absolute left-3 top-3 text-sm "> +48 </span>
                    <div className="border-r absolute left-12 top-1.5 border-gray-300 h-3/4  mb-1"></div>
                </div>
            </div>
            {/* Remove Email field - it's in User model and shouldn't be edited here or needs separate handling. 
                But if user wants to change it... 
                Let's assume this is strictly Profile Setup and Email is already set. 
                I will keep it read-only or remove it for simplicity. 
                Removing for now to reduce complexity, user can edit in Settings. 
                Or keep it but bind to nothing? Let's bind it just in case.
             */}
            <div className="flex items-center justify-center w-full ">
                <div className="relative w-full text-sm">
                    <span className="absolute left-2 -top-6 text-sm">Email kontaktowy (opcjonalny)</span>
                    <input
                        name="contact_email"
                        type="email"
                        placeholder=""
                        value={formData.contact_email || ""} // Assuming we might want a separate contact email
                        onChange={(e) => updateFormData('contact_email', e.target.value)}
                        className="w-full border border-gray-300 rounded-sm py-3 pl-10 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                    />
                    <Mail className="absolute left-2 top-3 text-purple-800" />
                </div>
            </div>
        </div>
    )
}