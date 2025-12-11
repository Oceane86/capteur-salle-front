// src/app/student/rooms/page.tsx
"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RoomCard from "@/components/RoomCard";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchRooms } from "@/lib/api";

type Room = {
  id: string;
  name: string;
  floor: number;
  occupied: boolean;
  lastMeasurement?: {
    co2: number;
    temperature: number;
    humidity: number;
  } | null;
  noise?: number;
  moduleId?: string;
};

export default function RoomsList() {
  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "occupied">("all");
  const [floorFilter, setFloorFilter] = useState<"all" | "1" | "2" | "3" | "4">("all");
  const [co2Filter, setCo2Filter] = useState<"all" | "good" | "warning">("all");

  const handleLogout = () => {
    router.push("/login");
  };

  // Récupération des salles depuis l'API
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const data = await fetchRooms();
        setRooms(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les salles.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Filtrage côté front
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && !room.occupied) ||
      (statusFilter === "occupied" && room.occupied);

    const roomFloor = room.floor.toString();
    const matchesFloor = floorFilter === "all" || roomFloor === floorFilter;

    let matchesCO2 = true;
    if (co2Filter === "good") matchesCO2 = room.lastMeasurement?.co2 !== undefined && room.lastMeasurement.co2 <= 800;
    else if (co2Filter === "warning") matchesCO2 = room.lastMeasurement?.co2 !== undefined && room.lastMeasurement.co2 > 800;

    return matchesSearch && matchesStatus && matchesFloor && matchesCO2;
  });

  return (
    <>
      <title>Dashboard Étudiants | Digital Campus</title>
      <meta name="description" content="Vue d'ensemble du campus" />

      <main className="min-h-screen bg-platinium" role="main">
        <Navbar role="student" onLogout={handleLogout} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-[#1A1A1A] mb-2">Salles disponibles</h1>
            <p className="text-[#5F6368]">Consultez l&apos;état en temps réel de toutes les salles du campus</p>
          </header>

          {/* Search & Filters */}
          <section aria-labelledby="room-filters" className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <h2 id="room-filters" className="sr-only">Filtres des salles</h2>

            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5F6368]" aria-hidden="true" />
              <input
                type="text"
                placeholder="Rechercher une salle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent"
                aria-label="Rechercher une salle"
              />
            </div>

            <div className="hidden lg:block w-px h-10 bg-gray-300" aria-hidden="true"></div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto lg:flex-1 items-center">
              <label className="sr-only" htmlFor="statusFilter">Filtrer par statut</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="flex-1 lg:flex-none lg:min-w-[160px] px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent text-[#1A1A1A]"
              >
                <option value="all">Toutes les salles</option>
                <option value="available">Disponibles</option>
                <option value="occupied">Occupées</option>
              </select>

              <label className="sr-only" htmlFor="floorFilter">Filtrer par étage</label>
              <select
                id="floorFilter"
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value as any)}
                className="flex-1 lg:flex-none lg:min-w-[140px] px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent text-[#1A1A1A]"
              >
                <option value="all">Tous les étages</option>
                <option value="1">Étage 1</option>
                <option value="2">Étage 2</option>
                <option value="3">Étage 3</option>
                <option value="4">Étage 4</option>
              </select>

              <label className="sr-only" htmlFor="co2Filter">Filtrer par niveau de CO₂</label>
              <select
                id="co2Filter"
                value={co2Filter}
                onChange={(e) => setCo2Filter(e.target.value as any)}
                className="flex-1 lg:flex-none lg:min-w-[160px] px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent text-[#1A1A1A]"
              >
                <option value="all">Tous les niveaux</option>
                <option value="good">Bon (≤ 800 ppm)</option>
                <option value="warning">À surveiller ({">"}800 ppm)</option>
              </select>

              {(statusFilter !== "all" || floorFilter !== "all" || co2Filter !== "all") && (
                <>
                  <div className="hidden lg:block w-px h-10 bg-gray-300" aria-hidden="true"></div>
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setFloorFilter("all");
                      setCo2Filter("all");
                    }}
                    className="px-4 py-2 border-2 border-gray-300 text-[#5F6368] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    aria-label="Réinitialiser les filtres"
                  >
                    Réinitialiser
                  </button>
                </>
              )}
            </div>
          </section>

          {/* Rooms Grid */}
          <section aria-labelledby="rooms-list">
            <h2 id="rooms-list" className="sr-only">Liste des salles</h2>

            {loading && <p role="status" aria-live="polite">Chargement des salles...</p>}
            {error && <p role="alert">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!loading && !error && filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={{
                    ...room,
                    temperature: room.lastMeasurement?.temperature ?? 0,
                    humidity: room.lastMeasurement?.humidity ?? 0,
                    co2: room.lastMeasurement?.co2 ?? 0,
                    brightness: 0,
                    needsAiring: room.lastMeasurement?.co2 !== undefined && room.lastMeasurement.co2 > 800,
                    status: room.occupied ? "occupied" : "available",
                    noise: room.noise ?? 0,      
                    moduleId: room.moduleId ?? '',
                  }}
                  onClick={() => router.push(`/student/room/${room.id}`)}
                />
              ))}
            </div>

            {!loading && !error && filteredRooms.length === 0 && (
              <div className="text-center py-12" role="status" aria-live="polite">
                <p className="text-[#5F6368]">Aucune salle trouvée</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
