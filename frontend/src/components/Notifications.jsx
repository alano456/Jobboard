import React, { useState, useEffect } from "react";
import api from "../api";
import { Bell, Check, Loader2, Trash2 } from "lucide-react";

export const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications/');
            const data = response.data.results ? response.data.results : response.data;
            setNotifications(data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {
        setMarkingAll(true);
        try {
            await api.post('/notifications/mark_all_read/');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        } finally {
            setMarkingAll(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/mark_read/`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-purple-600 size-8" />
            </div>
        );
    }

    return (
        <div className="flex px-10 h-full py-7 flex-col gap-6 min-h-full relative overflow-hidden">
            <div className="flex items-center w-full gap-10 justify-between">
                <h1 className="text-2xl text-slate-800 font-extrabold flex items-center gap-3">
                    <Bell className="text-purple-600" />
                    Powiadomienia
                </h1>
                {notifications.length > 0 && notifications.some(n => !n.is_read) && (
                    <button
                        onClick={markAllAsRead}
                        disabled={markingAll}
                        className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 disabled:opacity-50 transition-colors"
                    >
                        {markingAll ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                        Oznacz wszystkie jako przeczytane
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => !notification.is_read && markAsRead(notification.id)}
                            className={`p-4 rounded-lg border transition-all duration-200 ${notification.is_read
                                    ? 'bg-white border-gray-200 text-gray-600'
                                    : 'bg-purple-50 border-purple-200 shadow-sm cursor-pointer hover:bg-purple-100'
                                }`}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <p className={`text-sm ${notification.is_read ? '' : 'font-semibold text-slate-800'}`}>
                                    {notification.message}
                                </p>
                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                    {new Date(notification.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 gap-4">
                        <Bell className="size-12 opacity-20" />
                        <p>Brak powiadomień</p>
                    </div>
                )}
            </div>
        </div>
    );
};
