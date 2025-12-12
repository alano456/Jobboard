import React from "react";
import { User, Bell, Shield, Mail } from "lucide-react";

export const Settings = () => {
    return (
        <div className="flex px-10 h-full py-7 flex-col gap-6 min-h-full">
            <div className="flex items-center w-full gap-10 justify-between">
                <h1 className="text-2xl text-slate-800 font-extrabold">
                    Ustawienia
                </h1>
            </div>

            <div className="flex flex-col gap-4 max-w-2xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-slate-700 border-b pb-2">Moje Konto</h2>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-slate-600">
                        <User className="size-5" />
                        <div>
                            <p className="font-medium text-slate-800">Profil publiczny</p>
                            <p className="text-sm">Edytuj swoje dane widoczne dla rekruterów</p>
                        </div>
                    </div>
                    <button onClick={() => alert("Funkcja edycji profilu będzie dostępna wkrótce!")} className="text-sm text-purple-800 font-bold hover:underline">Edytuj</button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-slate-600">
                        <Mail className="size-5" />
                        <div>
                            <p className="font-medium text-slate-800">Adres Email</p>
                            <p className="text-sm">Zmień adres email powiązany z kontem</p>
                        </div>
                    </div>
                    <button onClick={() => alert("Funkcja zmiany emaila będzie dostępna wkrótce!")} className="text-sm text-purple-800 font-bold hover:underline">Zmień</button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3 text-slate-600">
                        <Shield className="size-5" />
                        <div>
                            <p className="font-medium text-slate-800">Hasło i bezpieczeństwo</p>
                            <p className="text-sm">Zaktualizuj swoje hasło</p>
                        </div>
                    </div>
                    <button onClick={() => alert("Funkcja zmiany hasła będzie dostępna wkrótce!")} className="text-sm text-purple-800 font-bold hover:underline">Zmień</button>
                </div>

                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 text-slate-600">
                        <Bell className="size-5" />
                        <div>
                            <p className="font-medium text-slate-800">Powiadomienia</p>
                            <p className="text-sm">Zarządzaj powiadomieniami email i push</p>
                        </div>
                    </div>
                    <button onClick={() => alert("Konfiguracja powiadomień będzie dostępna wkrótce!")} className="text-sm text-purple-800 font-bold hover:underline">Konfiguruj</button>
                </div>
            </div>
        </div>
    );
};
