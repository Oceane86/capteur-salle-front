// src/app/student/room/[roomId]/page.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Thermometer, Droplets, Wind, Sun, Volume2, AlertCircle, Calendar, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import ReservationModal from "@/components/ReservationModal";
import { mockRooms, generateHistoricalData } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function RoomDetails() {
    const router = useRouter();
    const pathname = usePathname();
    const roomId = pathname.split("/").pop();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const room = mockRooms.find(r => r.id === roomId);

    const handleLogout = () => {
        router.push("/login");
    };

    if (!room) {
        return (
            <div className="min-h-screen bg-[#F5F7FA]">
                <Navbar role="student" onLogout={handleLogout} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-[#5F6368] text-center">Salle non trouvée</p>
                </div>
            </div>
        );
    }

    const getComfortIndex = () => {
        let score = 100;
        if (room.co2 > 1000) score -= 30;
        else if (room.co2 > 800) score -= 15;
        if (room.temperature < 19 || room.temperature > 24) score -= 20;
        if (room.humidity < 40 || room.humidity > 60) score -= 15;
        if (room.noise > 50) score -= 10;

        if (score >= 80) return { label: "Excellent", color: "bg-[#00C853]" };
        if (score >= 60) return { label: "Bon", color: "bg-[#64DD17]" };
        if (score >= 40) return { label: "Moyen", color: "bg-[#FF8F00]" };
        return { label: "Faible", color: "bg-[#D50000]" };
    };

    const handleReservation = (data: { startTime: string; endTime: string; reason: string }) => {
        console.log("Réservation:", { roomId: room.id, ...data });
        setIsModalOpen(false);
    };

    const comfortIndex = getComfortIndex();
    const tempData = generateHistoricalData(room.temperature);
    const co2Data = generateHistoricalData(room.co2);

    return (
        <>
            <title>Détails de la salle | Digital Campus</title>
            <meta name="description" content="Détails de la salle" />

            <main className="min-h-screen bg-[#F5F7FA]" role="main">
                <Navbar role="student" onLogout={handleLogout} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => router.push("/student/rooms")}
                        className="flex items-center gap-2 text-[#5F6368] hover:text-[#0092bd] mb-6 transition-colors cursor-pointer"
                        aria-label="Retour à la liste des salles"
                    >
                        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                        <span>Retour aux salles</span>
                    </button>

                    {/* Header */}
                    <section aria-labelledby="room-header" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex-1">
                                <h1 id="room-header" className="text-[#1A1A1A] mb-2">{room.name}</h1>
                                <p className="text-[#5F6368]">Dernière mise à jour : il y a 2 minutes</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {room.needsAiring && (
                                    <AlertTriangle className="w-6 h-6 text-[#FF8F00]" aria-hidden="true" />
                                )}
                                <StatusBadge status={room.status} size="lg" aria-hidden="true" />
                                {room.status === 'available' && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center gap-2 bg-[#0092bd] text-white px-4 py-2 rounded-lg hover:bg-[#007a9a] transition-colors cursor-pointer"
                                        aria-label={`Réserver la salle ${room.name}`}
                                    >
                                        <Calendar className="w-5 h-5" aria-hidden="true" />
                                        <span>Réserver</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Alert for high CO2 */}
                    {room.needsAiring && (
                        <div className="bg-[#FFF3E0] border-l-4 border-[#FF8F00] rounded-lg p-4 mb-6 flex items-start gap-3" role="alert" aria-live="assertive">
                            <AlertCircle className="w-6 h-6 text-[#FF8F00] shrink-0" aria-hidden="true" />
                            <div>
                                <p className="text-[#FF8F00] mb-1 font-semibold">Aération nécessaire</p>
                                <p className="text-[#5F6368] text-sm">
                                    Le niveau de CO₂ est élevé ({room.co2} ppm). Il est recommandé d&apos;aérer la pièce.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Metrics Overview */}
                    <section aria-labelledby="room-metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <h2 id="room-metrics" className="sr-only">Mesures de la salle</h2>

                        {/* Temperature */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-[#F5F7FA] rounded-lg p-3">
                                    <Thermometer className="w-6 h-6 text-[#0092bd]" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-[#5F6368]">Température</p>
                                    <p className="text-[#1A1A1A] text-2xl">{room.temperature}°C</p>
                                </div>
                            </div>
                            <div className="h-16 min-h-16" aria-hidden="true">
                                <ResponsiveContainer width="100%" height={64}>
                                    <LineChart data={tempData.slice(-10)}>
                                        <Line type="monotone" dataKey="value" stroke="#0092bd" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Humidity */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-[#F5F7FA] rounded-lg p-3">
                                    <Droplets className="w-6 h-6 text-[#0092bd]" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-[#5F6368]">Humidité</p>
                                    <p className="text-[#1A1A1A] text-2xl">{room.humidity}%</p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2" aria-hidden="true">
                                    <div
                                        className="bg-[#0092bd] h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${room.humidity}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* CO2 */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-[#F5F7FA] rounded-lg p-3">
                                    <Wind className="w-6 h-6 text-[#0092bd]" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-[#5F6368]">CO₂</p>
                                    <p className="text-[#1A1A1A] text-2xl">{room.co2} ppm</p>
                                </div>
                            </div>
                            <div className="h-16 min-h-16" aria-hidden="true">
                                <ResponsiveContainer width="100%" height={64}>
                                    <LineChart data={co2Data.slice(-10)}>
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke={room.co2 > 1000 ? "#FF8F00" : "#0092bd"}
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Brightness */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#F5F7FA] rounded-lg p-3">
                                    <Sun className="w-6 h-6 text-[#0092bd]" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-[#5F6368]">Luminosité</p>
                                    <p className="text-[#1A1A1A] text-2xl">{room.brightness} lux</p>
                                </div>
                            </div>
                        </div>

                        {/* Noise */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#F5F7FA] rounded-lg p-3">
                                    <Volume2 className="w-6 h-6 text-[#0092bd]" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-[#5F6368]">Niveau sonore</p>
                                    <p className="text-[#1A1A1A] text-2xl">{room.noise} dB</p>
                                </div>
                            </div>
                        </div>

                        {/* Comfort Index */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3">
                                <div className={`${comfortIndex.color} rounded-lg p-3`}>
                                    <AlertCircle className="w-6 h-6 text-white" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-[#5F6368]">Indice de confort</p>
                                    <p className="text-[#1A1A1A] text-2xl">{comfortIndex.label}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Historical Charts */}
                    <section aria-labelledby="room-history" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <h2 id="room-history" className="sr-only">Historique des mesures</h2>

                        {/* Temperature Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-[#1A1A1A] mb-4">Évolution de la température</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={tempData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                                    <XAxis dataKey="time" stroke="#5F6368" />
                                    <YAxis stroke="#5F6368" />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#0092bd" strokeWidth={2} aria-hidden="true" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* CO2 Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-[#1A1A1A] mb-4">Évolution du CO₂</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={co2Data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                                    <XAxis dataKey="time" stroke="#5F6368" />
                                    <YAxis stroke="#5F6368" />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={room.co2 > 1000 ? "#FF8F00" : "#0092bd"}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>

                    {/* Reservation Modal */}
                    <ReservationModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        roomName={room.name}
                        onReserve={handleReservation}
                    />
                </div>
            </main>
        </>
    );
}
