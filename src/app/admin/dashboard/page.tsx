// src/app/admin/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { fetchRooms, fetchModules } from "@/lib/api";
import { Settings, Bell, Activity, AlertTriangle, Thermometer, Plus } from "lucide-react";

type Room = {
  _id: string;
  id?: string;
  name: string;
  floor: number;
  occupied: boolean;
  temperature?: number;
  co2?: number;
  moduleId?: string;
  needsAiring?: boolean;
};

type Module = {
  id: string;
  status: "online" | "offline";
};

export default function AdminDashboard() {
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les salles et modules depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [roomsData, modulesData] = await Promise.all([fetchRooms(), fetchModules()]);

        const enrichedRooms: Room[] = roomsData.map((r: any) => ({
          _id: r._id || r.id,
          id: r._id || r.id,
          name: r.name,
          floor: r.floor,
          occupied: r.occupied ?? false,
          temperature: r.lastMeasurement?.temperature ?? 0,
          co2: r.lastMeasurement?.co2 ?? 0,
          moduleId: r.moduleId ?? "",
          needsAiring: r.lastMeasurement?.co2 !== undefined ? r.lastMeasurement.co2 > 800 : false,
        }));

        setRooms(enrichedRooms);
        setModules(modulesData);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données du dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const avgTemp = rooms.length > 0
    ? (rooms.reduce((acc, r) => acc + (r.temperature ?? 0), 0) / rooms.length).toFixed(1)
    : 0;

  const avgCO2 = rooms.length > 0
    ? Math.round(rooms.reduce((acc, r) => acc + (r.co2 ?? 0), 0) / rooms.length)
    : 0;

  const occupancyRate = rooms.length > 0
    ? ((rooms.filter((r) => r.occupied).length / rooms.length) * 100).toFixed(0)
    : 0;

  const onlineModules = modules.filter((m) => m.status === "online").length;
  const offlineModules = modules.filter((m) => m.status === "offline").length;
  const latestAlerts = rooms.filter((r) => r.needsAiring);

  return (
    <>
      <title>Dashboard Administrateur | Digital Campus</title>
      <meta name="description" content="Vue d'ensemble des modules IoT et des alertes du campus" />

      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar role="admin" onLogout={() => {
          localStorage.removeItem("role");
          router.push("/login");
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <header className="mb-8" role="banner">
            <h1 className="text-[#1A1A1A] mb-2">Dashboard administrateur</h1>
            <p className="text-[#5F6368]">Vue d&apos;ensemble du campus</p>
          </header>

          {loading && <p role="status" aria-live="polite">Chargement des données...</p>}
          {error && <p role="alert">{error}</p>}

          {!loading && !error && (
            <>
              {/* Stats Grid */}
              <section role="region" aria-labelledby="stats-header" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <h2 id="stats-header" className="sr-only">Statistiques principales</h2>

                {/* Température moyenne */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#5F6368]">Température moyenne</p>
                    <div className="bg-[#F5F7FA] rounded-lg p-2">
                      <Thermometer className="w-5 h-5 text-[#0092bd]" aria-hidden="true" />
                    </div>
                  </div>
                  <p className="text-[#1A1A1A] text-3xl">{avgTemp}°C</p>
                </div>

                {/* CO₂ moyen */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#5F6368]">CO₂ moyen</p>
                    <div className="bg-[#F5F7FA] rounded-lg p-2">
                      <Bell className="w-5 h-5 text-[#0092bd]" aria-hidden="true" />
                    </div>
                  </div>
                  <p className="text-[#1A1A1A] text-3xl">{avgCO2} ppm</p>
                </div>

                {/* Taux d'occupation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#5F6368]">Taux d&apos;occupation</p>
                    <div className="bg-[#F5F7FA] rounded-lg p-2">
                      <Activity className="w-5 h-5 text-[#0092bd]" aria-hidden="true" />
                    </div>
                  </div>
                  <p className="text-[#1A1A1A] text-3xl">{occupancyRate}%</p>
                </div>

                {/* Modules IoT */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#5F6368]">Modules IoT</p>
                    <div className="bg-[#F5F7FA] rounded-lg p-2">
                      <Settings className="w-5 h-5 text-[#0092bd]" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#00C853]" aria-hidden="true" />
                      <span className="text-[#1A1A1A] text-2xl">{onlineModules}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#D50000]" aria-hidden="true" />
                      <span className="text-[#1A1A1A] text-2xl">{offlineModules}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Building Map */}
              <section role="region" aria-labelledby="building-map-header" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <h2 id="building-map-header" className="sr-only">Plan du bâtiment et modules</h2>
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[#1A1A1A]">Plan du bâtiment</h3>
                      <button
                        onClick={() => router.push('/admin/modules/create')}
                        aria-label="Ajouter un module"
                        className="flex items-center gap-2 bg-[#0092bd] text-white px-4 py-2 rounded-lg hover:bg-[#007a9d] transition-colors cursor-pointer"
                      >
                        <Plus className="w-5 h-5" aria-hidden="true" />
                        <span>Ajouter un module</span>
                      </button>
                    </div>
                    {/* Légende */}
                    <div className="flex items-center gap-6 mb-6 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#00C853]"></div>
                        <span className="text-[#5F6368] text-sm">Disponible</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-[#D50000]"></div>
                        <span className="text-[#5F6368] text-sm">Occupée</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-white bg-[#FF8F00] rounded p-0.5" />
                        <span className="text-[#5F6368] text-sm">Aération nécessaire</span>
                      </div>
                    </div>

                    {/* Rooms Grid */}
                    <div className="bg-[#F5F7FA] rounded-lg p-4 sm:p-8">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                        {rooms.map((room) => (
                          <button
                            key={room._id}
                            onClick={() => router.push(`/admin/room/${room._id}`)} // <-- Changement ici
                            className={`relative aspect-square rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center
          transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer
          ${!room.occupied ? 'bg-[#00C853]' : 'bg-[#D50000]'}`}
                            aria-label={`Salle ${room.name}, température ${room.temperature}°C, ${room.occupied ? 'occupée' : 'disponible'}${room.needsAiring ? ', aération nécessaire' : ''}`}
                          >
                            {room.needsAiring && (
                              <AlertTriangle className="absolute top-2 left-2 w-4 h-4 text-white" aria-hidden="true" />
                            )}
                            <p className="text-white text-center mb-1 text-xs sm:text-base">{room.name}</p>
                            <p className="text-white text-[10px] sm:text-xs opacity-90">{room.temperature}°C</p>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Recent Alerts Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" role="region" aria-labelledby="alerts-header">
                  <h3 id="alerts-header" className="text-[#1A1A1A] mb-6">Dernières alertes</h3>
                  <div className="space-y-4">
                    {latestAlerts.length > 0 ? (
                      latestAlerts.map((room) => (
                        <div
                          key={room._id}
                          className="border-l-4 border-[#FF8F00] bg-[#FFF3E0] rounded-r-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-[#FF8F00] shrink-0 mt-0.5" aria-hidden="true" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[#1A1A1A] mb-1 font-medium">{room.name}</p>
                              <p className="text-[#5F6368] text-sm break-words">
                                Nécessite une aération (CO₂: {room.co2} ppm)
                              </p>
                              <p className="text-[#5F6368] text-xs mt-2">
                                {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#5F6368]">Aucune alerte pour l'instant</p>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
