// src/app/student/room/[roomId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Thermometer, Droplets, Wind, Sun, Volume2, AlertCircle, Calendar, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import ReservationModal from "@/components/ReservationModal";
import ScheduleModal from "@/components/ScheduleModal";
import { useToast } from "@/components/Toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchRoomById, createReservation } from "@/lib/api";

export default function RoomDetails() {
    const router = useRouter();
    const pathname = usePathname();
    const roomId = pathname.split("/").pop() || "";

    const [roomData, setRoomData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    const { notify } = useToast();

    const handleLogout = () => router.push("/login");

    useEffect(() => {
        const loadRoom = async () => {
            try {
                setLoading(true);
                const data = await fetchRoomById(roomId);
                setRoomData(data);
            } catch (err) {
                console.error(err);
                setError("Salle non trouvée.");
            } finally {
                setLoading(false);
            }
        };
        loadRoom();
    }, [roomId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Chargement...</p>
            </div>
        );
    }

    if (error || !roomData?.room) {
        return (
            <div className="min-h-screen bg-[#F5F7FA]">
                <Navbar role="student" onLogout={handleLogout} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-[#5F6368] text-center">{error || "Salle non trouvée"}</p>
                    <button
                        onClick={() => router.push("/student/rooms")}
                        className="mt-4 px-4 py-2 bg-[#0092bd] text-white rounded-lg"
                        aria-label="Retour à la liste des salles"
                    >
                        Retour aux salles
                    </button>
                </div>
            </div>
        );
    }

    const room = {
        ...roomData.room,
        temperature: roomData.currentMeasurement?.temperature ?? 0,
        humidity: roomData.currentMeasurement?.humidity ?? 0,
        co2: roomData.currentMeasurement?.co2 ?? 0,
        brightness: roomData.currentMeasurement?.light ?? 0,
        noise: roomData.currentMeasurement?.soundDb ?? 0,
        needsAiring: roomData.currentMeasurement?.co2 !== undefined && roomData.currentMeasurement.co2 > 800,
        status: roomData.room.occupied ? "occupied" : "available",
    };

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

    const comfortIndex = getComfortIndex();

    const tempData = roomData.history?.map((m: any) => ({ time: new Date(m.timestamp).toLocaleTimeString(), value: m.temperature })) || [];
    const co2Data = roomData.history?.map((m: any) => ({ time: new Date(m.timestamp).toLocaleTimeString(), value: m.co2 })) || [];

    const handleReservation = async (data: { startTime: string; endTime: string; reason: string }) => {
        try {
            // Déterminer le reasonType et customReason
            let reasonType: 'course' | 'meeting' | 'exam' | 'study' | 'other' = 'other';
            let customReason: string | undefined;

            switch (data.reason) {
                case 'Cours':
                case 'TD':
                case 'TP':
                    reasonType = 'course';
                    break;
                case 'Réunion':
                    reasonType = 'meeting';
                    break;
                case 'Projet':
                case 'Étude en groupe':
                    reasonType = 'study';
                    break;
                default:
                    reasonType = 'other';
                    customReason = data.reason;
            }

            // Convertir les heures en dates complètes ISO
            const today = new Date();
            const [startHour, startMinute] = data.startTime.split(":").map(Number);
            const [endHour, endMinute] = data.endTime.split(":").map(Number);

            const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
            const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);

            // Appel API avec dates complètes
            await createReservation(room.id, startDate.toISOString(), endDate.toISOString(), reasonType, customReason);

            setIsModalOpen(false);
            notify("Réservation effectuée avec succès !", "success");

        } catch (err: any) {
            console.error(err);
            notify(err.response?.data?.message || "Erreur lors de la réservation. Veuillez réessayer.", "error");
        }
    };

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

                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex-1">
                                <h1 className="text-[#1A1A1A] mb-2">{room.name}</h1>
                                <p className="text-[#5F6368]">Dernière mise à jour : {roomData.currentMeasurement?.timestamp ? new Date(roomData.currentMeasurement.timestamp).toLocaleString() : "N/A"}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {room.needsAiring && <AlertTriangle className="w-6 h-6 text-[#FF8F00]" />}
                                <StatusBadge status={room.status} size="lg" />
                                {room.status === "available" && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center gap-2 bg-[#0092bd] text-white px-4 py-2 rounded-lg hover:bg-[#007a9a] cursor-pointer"
                                        aria-label="Ouvrir le modal de réservation"
                                    >
                                        <Calendar className="w-5 h-5" aria-hidden="true" />
                                        <span>Réserver</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsScheduleOpen(true)}
                                    className="flex items-center gap-2 bg-[#64DD17] text-white px-4 py-2 rounded-lg hover:bg-[#4CAF50] cursor-pointer"
                                    aria-label="Voir le planning"
                                >
                                    <Calendar className="w-5 h-5" aria-hidden="true" />
                                    <span>Planning</span>
                                </button>
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
                    
                    {/* Schedule Modal */}
                    <ScheduleModal
                        isOpen={isScheduleOpen}
                        onClose={() => setIsScheduleOpen(false)}
                        roomName={room.name}
                        reservations={roomData.reservations || []}
                    />
                </div>
            </main>
        </>
    );
}
