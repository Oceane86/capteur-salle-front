// src/app/admin/dashboard/page.tsx
"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { mockRooms, mockModules, mockAlerts } from "@/data/mockData";
import { Settings, Bell, Activity, AlertTriangle, Thermometer, Plus } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();

  const avgTemp = (mockRooms.reduce((acc, room) => acc + room.temperature, 0) / mockRooms.length).toFixed(1);
  const avgCO2 = Math.round(mockRooms.reduce((acc, room) => acc + room.co2, 0) / mockRooms.length);
  const occupancyRate = ((mockRooms.filter((r) => r.status === "occupied").length / mockRooms.length) * 100).toFixed(0);
  const onlineModules = mockModules.filter((m) => m.status === "online").length;
  const offlineModules = mockModules.filter((m) => m.status === "offline").length;

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
            <p className="text-[#5F6368]">Vue d&apos;ensemble du campus IoT</p>
          </header>

          {/* Stats Grid */}
          <section role="region" aria-labelledby="stats-header" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <h2 id="stats-header" className="sr-only">Statistiques principales</h2>

            {/** Average Temperature */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#5F6368]">Température moyenne</p>
                <div className="bg-[#F5F7FA] rounded-lg p-2">
                  <Thermometer className="w-5 h-5 text-[#0092bd]" aria-hidden="true" />
                </div>
              </div>
              <p className="text-[#1A1A1A] text-3xl">{avgTemp}°C</p>
            </div>

            {/** Average CO2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#5F6368]">CO₂ moyen</p>
                <div className="bg-[#F5F7FA] rounded-lg p-2">
                  <Bell className="w-5 h-5 text-[#0092bd]" aria-hidden="true" />
                </div>
              </div>
              <p className="text-[#1A1A1A] text-3xl">{avgCO2} ppm</p>
            </div>

            {/** Occupancy Rate */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#5F6368]">Taux d&apos;occupation</p>
                <div className="bg-[#F5F7FA] rounded-lg p-2">
                  <Activity className="w-5 h-5 text-[#0092bd]" aria-hidden="true" />
                </div>
              </div>
              <p className="text-[#1A1A1A] text-3xl">{occupancyRate}%</p>
            </div>

            {/** Modules Status */}
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

                {/* Rooms Grid */}
                <div className="bg-[#F5F7FA] rounded-lg p-4 sm:p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                    {mockRooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => router.push(`/admin/modules/${room.moduleId}`)}
                        className={`
                          aspect-square rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center
                          transition-all duration-200 hover:scale-105 hover:shadow-md
                          ${room.status === 'available' ? 'bg-[#00C853]' : ''}
                          ${room.status === 'occupied' ? 'bg-[#D50000]' : ''}
                        `}
                        aria-label={`Salle ${room.name}, température ${room.temperature} degrés, ${room.status}`}
                      >
                        {room.needsAiring && (
                          <AlertTriangle className="absolute top-1 left-1 sm:top-2 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 text-white" aria-hidden="true" />
                        )}
                        <p className="text-white text-center mb-1 text-xs sm:text-base">{room.name}</p>
                        <p className="text-white text-[10px] sm:text-xs opacity-90">{room.temperature}°C</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" role="region" aria-labelledby="alerts-header">
              <h3 id="alerts-header" className="text-[#1A1A1A] mb-6">Dernières alertes</h3>
              <div className="space-y-4">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className="border-l-4 border-[#FF8F00] bg-[#FFF3E0] rounded-r-lg p-4">
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-[#FF8F00] shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#1A1A1A] mb-1">{alert.roomName}</p>
                        <p className="text-[#5F6368] text-sm break-words">{alert.message}</p>
                        <p className="text-[#5F6368] text-xs mt-2">
                          {new Date(alert.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section role="region" aria-labelledby="quick-actions-header" className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <h2 id="quick-actions-header" className="sr-only">Actions rapides</h2>

            <button
              onClick={() => router.push('/admin/modules')}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all text-left group cursor-pointer"
              aria-label="Gérer les modules"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#F5F7FA] rounded-lg p-3 group-hover:bg-[#0092bd] transition-colors">
                  <Activity className="w-6 h-6 text-[#0092bd] group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[#1A1A1A] mb-1">Gérer les modules</h3>
                  <p className="text-[#5F6368] text-sm">Voir et configurer tous les modules IoT</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/admin/modules/create')}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all text-left group cursor-pointer"
              aria-label="Ajouter un module"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#F5F7FA] rounded-lg p-3 group-hover:bg-[#00C853] transition-colors">
                  <Settings className="w-6 h-6 text-[#00C853] group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[#1A1A1A] mb-1">Ajouter un module</h3>
                  <p className="text-[#5F6368] text-sm">Configurer un nouveau capteur IoT</p>
                </div>
              </div>
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" role="region" aria-labelledby="active-alerts-header">
              <h3 id="active-alerts-header" className="sr-only">Alertes actives</h3>
              <div className="flex items-center gap-4">
                <div className="bg-[#F5F7FA] rounded-lg p-3">
                  <Bell className="w-6 h-6 text-[#FF8F00]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-[#1A1A1A] mb-1">Alertes actives</h3>
                  <p className="text-[#5F6368] text-sm">{mockAlerts.length} alertes en cours</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
