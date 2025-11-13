import React from "react";
import Editor from "./TextEditor";

export const BasicInformation = () => {

    return (
        <div className="flex items-center justify-center gap-5 flex-col">
            <div className="w-full flex gap-2 items-center justify-center flex-col">
                <h1 className="text-md text-slate-800 font-extrabold">Prześlij Logo i Baner firmy</h1>
                <div className="flex items-center flex-row gap-2">
                    <div className="flex items-center justify-center w-1/3 aspect-square">
                        <label htmlFor="dropzone-file" className="flex text-center flex-col items-center justify-center px-3 w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 "><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 ">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input type="file" className="hidden" />
                        </label>
                    </div>

                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex text-center flex-col items-center justify-center px-3 w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 "><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 ">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input type="file" className="hidden" />
                        </label>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center w-full">
                <div className="flex items-center justify-center w-full">
                    <div className="relative w-full text-sm">
                        <input
                            name="text"
                            type="text"
                            placeholder=""
                            className="w-full border-2 border-slate-300 rounded-sm py-1.5   focus:border-b-2 focus:border-purple-600 transition-colors focus:outline-none peer bg-inherit px-2"
                        />
                        <label
                            htmlFor="text"
                            className="absolute text-slate-400 -top-5 text-sm left-2 cursor-text peer-focus:text-md peer-focus:-top-5 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-2 peer-placeholder-shown:text-md"
                        >
                            Nazwa firmy
                        </label>
                    </div>
                </div>
            </div>
            <Editor />


        </div>
    )
}

export const AboutEmployer = () => {

    return (
        <div className=""></div>
    )
}

export const ContactInformation = () => {

    return (
        <div className=""></div>
    )
}