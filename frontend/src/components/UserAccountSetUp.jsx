import React, { useState } from "react";
import Editor from "./TextEditor";
import MyDatePicker from "./DatePicker";
import { countries } from "countries-list";
import { Github, Link, Linkedin, Mail, MapPin } from "lucide-react";

const countryArray = Object.entries(countries).map(([code, data]) => ({
    code,
    name: data.native || data.name,
}));


export const countriesPl = [
    { code: "AF", name: "Afganistan" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algieria" },
    { code: "AD", name: "Andora" },
    { code: "AO", name: "Angola" },
    { code: "AG", name: "Antigua i Barbuda" },
    { code: "SA", name: "Arabia Saudyjska" },
    { code: "AR", name: "Argentyna" },
    { code: "AM", name: "Armenia" },
    { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" },
    { code: "AZ", name: "Azerbejdżan" },
    { code: "BS", name: "Bahamy" },
    { code: "BH", name: "Bahrajn" },
    { code: "BD", name: "Bangladesz" },
    { code: "BB", name: "Barbados" },
    { code: "BY", name: "Białoruś" },
    { code: "BE", name: "Belgia" },
    { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" },
    { code: "BT", name: "Bhutan" },
    { code: "BO", name: "Boliwia" },
    { code: "BA", name: "Bośnia i Hercegowina" },
    { code: "BW", name: "Botswana" },
    { code: "BR", name: "Brazylia" },
    { code: "BN", name: "Brunei" },
    { code: "BG", name: "Bułgaria" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "KH", name: "Kambodża" },
    { code: "CM", name: "Kamerun" },
    { code: "CA", name: "Kanada" },
    { code: "CV", name: "Republika Zielonego Przylądka" },
    { code: "CF", name: "Republika Środkowoafrykańska" },
    { code: "TD", name: "Czad" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "Chiny" },
    { code: "CO", name: "Kolumbia" },
    { code: "KM", name: "Komory" },
    { code: "CG", name: "Kongo" },
    { code: "CR", name: "Kostaryka" },
    { code: "HR", name: "Chorwacja" },
    { code: "CU", name: "Kuba" },
    { code: "CY", name: "Cypr" },
    { code: "CZ", name: "Czechy" },
    { code: "DK", name: "Dania" },
    { code: "DJ", name: "Dżibuti" },
    { code: "DO", name: "Dominikana" },
    { code: "EC", name: "Ekwador" },
    { code: "EG", name: "Egipt" },
    { code: "SV", name: "Salwador" },
    { code: "GQ", name: "Gwinea Równikowa" },
    { code: "ER", name: "Erytrea" },
    { code: "EE", name: "Estonia" },
    { code: "SZ", name: "Eswatini" },
    { code: "ET", name: "Etiopia" },
    { code: "FJ", name: "Fidżi" },
    { code: "FI", name: "Finlandia" },
    { code: "FR", name: "Francja" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GE", name: "Gruzja" },
    { code: "DE", name: "Niemcy" },
    { code: "GH", name: "Ghana" },
    { code: "GR", name: "Grecja" },
    { code: "GD", name: "Grenada" },
    { code: "GT", name: "Gwatemala" },
    { code: "GN", name: "Gwinea" },
    { code: "GY", name: "Gujana" },
    { code: "HT", name: "Haiti" },
    { code: "HN", name: "Honduras" },
    { code: "HU", name: "Węgry" },
    { code: "IS", name: "Islandia" },
    { code: "IN", name: "Indie" },
    { code: "ID", name: "Indonezja" },
    { code: "IR", name: "Iran" },
    { code: "IQ", name: "Irak" },
    { code: "IE", name: "Irlandia" },
    { code: "IL", name: "Izrael" },
    { code: "IT", name: "Włochy" },
    { code: "CI", name: "Wybrzeże Kości Słoniowej" },
    { code: "JM", name: "Jamajka" },
    { code: "JP", name: "Japonia" },
    { code: "JO", name: "Jordania" },
    { code: "KZ", name: "Kazachstan" },
    { code: "KE", name: "Kenia" },
    { code: "KI", name: "Kiribati" },
    { code: "KP", name: "Korea Północna" },
    { code: "KR", name: "Korea Południowa" },
    { code: "KW", name: "Kuwejt" },
    { code: "KG", name: "Kirgistan" },
    { code: "LA", name: "Laos" },
    { code: "LV", name: "Łotwa" },
    { code: "LB", name: "Liban" },
    { code: "LS", name: "Lesotho" },
    { code: "LR", name: "Liberia" },
    { code: "LY", name: "Libia" },
    { code: "LI", name: "Liechtenstein" },
    { code: "LT", name: "Litwa" },
    { code: "LU", name: "Luksemburg" },
    { code: "MG", name: "Madagaskar" },
    { code: "MW", name: "Malawi" },
    { code: "MY", name: "Malezja" },
    { code: "MV", name: "Malediwy" },
    { code: "ML", name: "Mali" },
    { code: "MT", name: "Malta" },
    { code: "MA", name: "Maroko" },
    { code: "MH", name: "Wyspy Marshalla" },
    { code: "MU", name: "Mauritius" },
    { code: "MR", name: "Mauretania" },
    { code: "MX", name: "Meksyk" },
    { code: "FM", name: "Mikronezja" },
    { code: "MD", name: "Mołdawia" },
    { code: "MC", name: "Monako" },
    { code: "MN", name: "Mongolia" },
    { code: "ME", name: "Czarnogóra" },
    { code: "MZ", name: "Mozambik" },
    { code: "MM", name: "Mjanma" },
    { code: "NA", name: "Namibia" },
    { code: "NR", name: "Nauru" },
    { code: "NP", name: "Nepal" },
    { code: "NL", name: "Holandia" },
    { code: "NZ", name: "Nowa Zelandia" },
    { code: "NI", name: "Nikaragua" },
    { code: "NE", name: "Niger" },
    { code: "NG", name: "Nigeria" },
    { code: "MK", name: "Północna Macedonia" },
    { code: "NO", name: "Norwegia" },
    { code: "OM", name: "Oman" },
    { code: "PK", name: "Pakistan" },
    { code: "PW", name: "Palau" },
    { code: "PA", name: "Panama" },
    { code: "PG", name: "Papua-Nowa Gwinea" },
    { code: "PY", name: "Paragwaj" },
    { code: "PE", name: "Peru" },
    { code: "PH", name: "Filipiny" },
    { code: "PL", name: "Polska" },
    { code: "PT", name: "Portugalia" },
    { code: "QA", name: "Katar" },
    { code: "RO", name: "Rumunia" },
    { code: "RU", name: "Rosja" },
    { code: "RW", name: "Rwanda" },
    { code: "KN", name: "Saint Kitts i Nevis" },
    { code: "LC", name: "Saint Lucia" },
    { code: "VC", name: "Saint Vincent i Grenadyny" },
    { code: "WS", name: "Samoa" },
    { code: "SM", name: "San Marino" },
    { code: "ST", name: "Wyspy Świętego Tomasza i Książęca" },
    { code: "SN", name: "Senegal" },
    { code: "RS", name: "Serbia" },
    { code: "SC", name: "Seszele" },
    { code: "SL", name: "Sierra Leone" },
    { code: "SG", name: "Singapur" },
    { code: "SK", name: "Słowacja" },
    { code: "SI", name: "Słowenia" },
    { code: "SB", name: "Wyspy Salomona" },
    { code: "SO", name: "Somalia" },
    { code: "ZA", name: "Republika Południowej Afryki" },
    { code: "ES", name: "Hiszpania" },
    { code: "LK", name: "Sri Lanka" },
    { code: "SD", name: "Sudan" },
    { code: "SR", name: "Surinam" },
    { code: "SE", name: "Szwecja" },
    { code: "CH", name: "Szwajcaria" },
    { code: "SY", name: "Syria" },
    { code: "TW", name: "Tajwan" },
    { code: "TJ", name: "Tadżykistan" },
    { code: "TZ", name: "Tanzania" },
    { code: "TH", name: "Tajlandia" },
    { code: "TL", name: "Timor Wschodni" },
    { code: "TG", name: "Togo" },
    { code: "TO", name: "Tonga" },
    { code: "TT", name: "Trynidad i Tobago" },
    { code: "TN", name: "Tunezja" },
    { code: "TR", name: "Turcja" },
    { code: "TM", name: "Turkmenistan" },
    { code: "TV", name: "Tuvalu" },
    { code: "UG", name: "Uganda" },
    { code: "UA", name: "Ukraina" },
    { code: "AE", name: "Zjednoczone Emiraty Arabskie" },
    { code: "GB", name: "Wielka Brytania" },
    { code: "UY", name: "Urugwaj" },
    { code: "UZ", name: "Uzbekistan" },
    { code: "VU", name: "Vanuatu" },
    { code: "VA", name: "Watykan" },
    { code: "VE", name: "Wenezuela" },
    { code: "VN", name: "Wietnam" },
    { code: "YE", name: "Jemen" },
    { code: "ZM", name: "Zambia" },
    { code: "ZW", name: "Zimbabwe" }
];


export const BasicInformationUser = ({ formData, updateFormData }) => {

    return (
        <div className="flex items-center justify-center gap-9 flex-col">
            <div className="w-full flex items-center justify-between pt-5 gap-5">
                <div className="flex flex-1 ">
                    <div className="relative flex-1"><span className="absolute left-2 -top-6 text-sm">Wyksztalcenie</span>
                        <select
                            value={formData.education}
                            onChange={(e) => updateFormData('education', e.target.value)}
                            className="w-full px-2 py-3 border tracking-wide bg-transparent text-gray-500 rounded-sm border-gray-300 text-sm focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer cursor-pointer"
                        >
                            <option value="">Wykształcenie</option>
                            <option value="p">Podstawowe</option>
                            <option value="s">Średnie</option>
                            <option value="w">Wyższe</option>
                        </select></div>
                </div>
                <div className="flex flex-1 items-center justify-center ">
                    <div className="relative w-full text-sm">
                        <span className="absolute left-2 -top-6 text-sm">Doświadzcenie (liczba lat ogółem)</span>
                        <input
                            name="text"
                            type="number"
                            placeholder=""
                            value={formData.expirience}
                            onChange={(e) => updateFormData('expirience', e.target.value)}
                            className="w-full border border-gray-300 rounded-sm py-3  focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-3"
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center w-full mt-3 ">
                <div className="relative w-full text-sm">
                    <span className="absolute left-2 -top-6 text-sm">Strona internetowa (opcjonalne)</span>
                    <input
                        name="text"
                        type="text"
                        placeholder=""
                        value={formData.web}
                        onChange={(e) => updateFormData('web', e.target.value)}
                        className="w-full border border-gray-300 rounded-sm py-3 pl-10 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                    />
                    <Link className="absolute left-2 top-3 text-purple-800" />
                </div>
            </div>
            <div className="flex items-center justify-center w-full ">
                <div className="relative w-full text-sm">
                    <span className="absolute left-2 -top-6 text-sm">Strona GitHub (opcjonalne)</span>
                    <input
                        name="text"
                        type="text"
                        placeholder=""
                        value={formData.github}
                        onChange={(e) => updateFormData('github', e.target.value)}
                        className="w-full border border-gray-300 rounded-sm py-3 pl-10 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                    />
                    <Github className="absolute left-2 top-3 text-purple-800" />
                </div>
            </div>
            <div className="flex items-center justify-center w-full ">
                <div className="relative w-full text-sm">
                    <span className="absolute left-2 -top-6 text-sm">LinkedIn (opcjonalne)</span>
                    <input
                        name="text"
                        type="text"
                        placeholder=""
                        value={formData.linkedin}
                        onChange={(e) => updateFormData('linkedin', e.target.value)}
                        className="w-full border border-gray-300 rounded-sm py-3 pl-10 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                    />
                    <Linkedin className="absolute left-2 top-3 text-purple-800" />
                </div>
            </div>
            <div className="flex  relative items-center w-full gap-4 justify-between flex-row mt-3">
                <span className="absolute left-2 -top-6 text-sm">Narodowość</span>
                <select
                    value={formData.nationality}
                    onChange={(e) => updateFormData('nationality', e.target.value)}
                    className="flex-1 px-2 py-3 border tracking-wide bg-transparent text-gray-500 rounded-sm border-gray-300  text-sm  focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer  cursor-pointer"
                >
                    <option value="">Wybierz narodowość</option>
                    {countriesPl.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.name}
                        </option>
                    ))}
                </select>
                <div style={{ width: "32%" }}>
                    <MyDatePicker text={'Data urodzenia'} date={formData.birthday} setDate={(newDate) => updateFormData('birthday', newDate)} />
                </div>
            </div>
            <div className="flex items-center justify-between w-full gap-4">
                <div className="relative flex-1"><span className="absolute left-2 -top-6 text-sm">Plec</span>
                    <select
                        value={formData.gender}
                        onChange={(e) => updateFormData('gender', e.target.value)}
                        className="w-full px-2 py-3 border tracking-wide bg-transparent text-gray-500 rounded-sm border-gray-300 text-sm focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer cursor-pointer"
                    >
                        <option value="">Wybierz płeć</option>
                        <option value="M">Mężczyzna</option>
                        <option value="K">Kobieta</option>
                        <option value="N">Nie chcę podawać</option>
                    </select></div>
                <div className="relative flex-1">
                    <span className="absolute left-2 -top-6 text-sm">Stan cywilny</span>
                    <select
                        value={formData.maritalStatus}
                        onChange={(e) => updateFormData('maritalStatus', e.target.value)}
                        className="w-full px-2 py-3 border tracking-wide bg-transparent text-gray-500 rounded-sm border-gray-300 text-sm focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer cursor-pointer"
                    >
                        <option value="">Wybierz stan cywilny</option>
                        <option value="single">Singiel / Singielka</option>
                        <option value="married">Żonaty / Zamężna</option>
                        <option value="divorced">Rozwiedziony / Rozwiedziona</option>
                        <option value="widowed">Wdowiec / Wdowa</option>
                        <option value="other">Inny</option>
                    </select>
                </div>
            </div>
            <div className="w-full relative mt-3">
                <h1 className="text-sm pb-2 absolute left-2 -top-6">O sobie</h1>
                <Editor onChange={(html) => updateFormData('description', html)} value={formData.description} placeholder="Opisz siebie..." />
            </div>
        </div>
    )
}

export const CVUser = ({ formData, updateFormData }) => {

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        updateFormData('photo', file);

        const reader = new FileReader();
        reader.onload = () => {
            updateFormData('photoPreview', reader.result);
        };
        reader.readAsDataURL(file);
    }

    const handleCVUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        updateFormData('cv', file);

        if (file.type === "application/pdf") {
            updateFormData('cvPreview', "PDF")
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            updateFormData('cvPrewiew', reader.result)
        };
        reader.readAsDataURL(file);
    }


    return (
        <div className="flex items-center justify-center gap-5 flex-col">
            <div className="w-full flex items-start justify-center flex-col ">
                <h1 className="text-md text-slate-800 font-extrabold">Prześlij swoje Zjęcie i CV</h1>
                <div className="flex items-center justify-center w-full gap-10 pt-8">
                    <div className=" flex items-center relative justify-center ">
                        <span className="absolute left-2 -top-3 text-sm">Zdjęcie</span>
                        <label className="flex w-60 h-60 mt-4 text-center flex-col  items-center justify-center px-3 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            {!formData.photoPreview ? (
                                <div className="flex flex-col items-center justify-center px-3 py-5  aspect-square">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 "><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 "> PNG, JPEG or JPG  </p>
                                </div>
                            ) : (
                                <img src={formData.photoPreview} alt="Photo" className="w-full h-4/5 object-contain" />
                            )}
                            <input id="dropzone-photo" type="file" onChange={handlePhotoUpload} accept="image/jpeg, image/png, image/svg, image/jpg" className="hidden" />
                        </label>
                    </div>

                    <div className=" flex items-center relative justify-center ">
                        <span className="absolute left-2 -top-3 text-sm">CV</span>
                        <label className="flex mt-4 w-60 h-60 text-center flex-col  items-center justify-center px-3 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            {!formData.cvPreview ? (
                                <div className="flex flex-col items-center justify-center px-3 py-5  aspect-square">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 "><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500 "> PNG, JPEG, JPG or PDF </p>
                                </div>
                            ) : formData.cvPreview === "PDF" && formData.cv ? (
                                <div className="flex flex-col items-center justify-center w-full h-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width='100%' height='100%'><path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z" /><path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z" /><path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z" /><path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z" /><path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892" /><path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035" /><path fill="#909090" d="M23.954 2.077V7.95h5.633z" /><path fill="#f4f4f4" d="M24.031 2v5.873h5.633z" /><path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892" /></svg>
                                    <p className="text-sm text-gray-700 mt-2">{formData.cv?.name}</p>
                                </div>
                            ) : (
                                <img src={formData.cvPreview} alt="CV" className="w-full h-4/5 object-contain" />
                            )}
                            <input id="dropzone-cv" type="file" onChange={handleCVUpload} accept="image/jpeg, image/png, application/pdf, image/jpg" className="hidden" />
                        </label>
                    </div>
                </div>
            </div>

        </div>
    )
}

export const ContactInformationUser = ({ formData, updateFormData }) => {

    return (
        <div className="pt-5 flex flex-col gap-10 ">
            <div className="flex items-center justify-center w-full ">
                <div className="relative w-full text-sm">
                    <span className="absolute left-2 -top-6 text-sm">Lokalizacja</span>
                    <input
                        name="text"
                        type="text"
                        placeholder=""
                        value={formData.localization}
                        onChange={(e) => updateFormData('localization', e.target.value)}
                        className="w-full border border-gray-300 top-2 rounded-sm py-3 pl-10 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                    />
                    <MapPin className="absolute left-2 top-3 text-purple-800" />
                </div>
            </div>
            <div className="flex items-center justify-center w-full ">
                <div className="relative w-full text-sm">
                    <span className="absolute left-2 -top-6 text-sm">Numer telefonu</span>
                    <input
                        name="phone"
                        type="tel"
                        placeholder=""
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        className="w-full border border-gray-300 rounded-sm py-3 pl-15 focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                    />
                    <span className="absolute left-3 top-3 text-sm "> +48 </span>
                    <div className="border-r absolute left-12 top-1.5 border-gray-300 h-3/4  mb-1"></div>
                </div>
            </div>
        </div>
    )
}