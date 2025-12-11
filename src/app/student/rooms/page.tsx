// src/app/student/rooms/page.tsx
"use client";
import { useRouter } from "next/navigation";
import Navbar from '@/components/Navbar';
import RoomCard from '@/components/RoomCard';
import { mockRooms } from '@/data/mockData';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface RoomsListProps {
  onLogout: () => void;
}

export default function RoomsList({ onLogout }: RoomsListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied'>('all');
  const [floorFilter, setFloorFilter] = useState<'all' | '1' | '2' | '3' | '4'>('all');
  const [co2Filter, setCo2Filter] = useState<'all' | 'good' | 'warning'>('all');

  const filteredRooms = mockRooms.filter(room => {
    // Search filter
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    
    // Floor filter
    const roomFloor = room.name.split('.')[0].replace('Salle ', '');
    const matchesFloor = floorFilter === 'all' || roomFloor === floorFilter;
    
    // CO2 filter
    let matchesCO2 = true;
    if (co2Filter === 'good') {
      matchesCO2 = room.co2 <= 800;
    } else if (co2Filter === 'warning') {
      matchesCO2 = room.co2 > 800;
    }
    
    return matchesSearch && matchesStatus && matchesFloor && matchesCO2;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar role="student" onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#1A1A1A] mb-2">Salles disponibles</h1>
          <p className="text-[#5F6368]">Consultez l&apos;état en temps réel de toutes les salles du campus</p>
        </div>

        {/* Search Bar and Filters */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Search Bar */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5F6368]" />
            <input
              type="text"
              placeholder="Rechercher une salle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent"
            />
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px h-10 bg-gray-300"></div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto lg:flex-1 items-center">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="flex-1 lg:flex-none lg:min-w-[160px] px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent text-[#1A1A1A]"
            >
              <option value="all">Toutes les salles</option>
              <option value="available">Disponibles</option>
              <option value="occupied">Occupées</option>
            </select>

            {/* Floor Filter */}
            <select
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

            {/* CO2 Filter */}
            <select
              value={co2Filter}
              onChange={(e) => setCo2Filter(e.target.value as any)}
              className="flex-1 lg:flex-none lg:min-w-[160px] px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent text-[#1A1A1A]"
            >
              <option value="all">Tous les niveaux</option>
              <option value="good">Bon (≤ 800 ppm)</option>
              <option value="warning">À surveiller ({'>'}800 ppm)</option>
            </select>

            {/* Vertical Divider and Clear Button - Only show when filters are active */}
            {(statusFilter !== 'all' || floorFilter !== 'all' || co2Filter !== 'all') && (
              <>
                <div className="hidden lg:block w-px h-10 bg-gray-300"></div>
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setFloorFilter('all');
                  }}
                  className="px-4 py-2 border-2 border-gray-300 text-[#5F6368] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Réinitialiser
                </button>
              </>
            )}
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => router.push(`/student/room/${room.id}`)}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#5F6368]">Aucune salle trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}