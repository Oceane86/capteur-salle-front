// src/components/RoomCard.tsx
import { Thermometer, Droplets, Wind, Sun, Volume2, AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { Room } from '@/data/mockData';

interface RoomCardProps {
  room: Room;
  onClick?: () => void;
}

export default function RoomCard({ room, onClick }: RoomCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#1A1A1A]">{room.name}</h3>
        <div className="flex items-center gap-2">
          {room.needsAiring && (
            <AlertTriangle className="w-5 h-5 text-[#FF8F00]" />
          )}
          <StatusBadge status={room.status} size="sm" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="flex items-center gap-2">
          <div className="bg-[#F5F7FA] rounded-lg p-2">
            <Thermometer className="w-4 h-4 text-[#0092bd]" />
          </div>
          <div>
            <p className="text-[#5F6368] text-xs">Température</p>
            <p className="text-[#1A1A1A]">{room.temperature}°C</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-2">
          <div className="bg-[#F5F7FA] rounded-lg p-2">
            <Droplets className="w-4 h-4 text-[#0092bd]" />
          </div>
          <div>
            <p className="text-[#5F6368] text-xs">Humidité</p>
            <p className="text-[#1A1A1A]">{room.humidity}%</p>
          </div>
        </div>

        {/* CO2 */}
        <div className="flex items-center gap-2">
          <div className="bg-[#F5F7FA] rounded-lg p-2">
            <Wind className="w-4 h-4 text-[#0092bd]" />
          </div>
          <div>
            <p className="text-[#5F6368] text-xs">CO₂</p>
            <p className="text-[#1A1A1A]">{room.co2} ppm</p>
          </div>
        </div>

        {/* Brightness */}
        <div className="flex items-center gap-2">
          <div className="bg-[#F5F7FA] rounded-lg p-2">
            <Sun className="w-4 h-4 text-[#0092bd]" />
          </div>
          <div>
            <p className="text-[#5F6368] text-xs">Luminosité</p>
            <p className="text-[#1A1A1A]">{room.brightness} lux</p>
          </div>
        </div>
      </div>

      {/* Warning for high CO2 */}
      {room.needsAiring && (
        <div className="mt-4 bg-[#FFF3E0] border border-[#FF8F00] rounded-lg p-3 flex items-start gap-2">
          <Wind className="w-4 h-4 text-[#FF8F00] mt-0.5 flex-shrink-0" />
          <p className="text-[#FF8F00] text-sm">
            Niveau de CO₂ élevé. Aération recommandée.
          </p>
        </div>
      )}
    </div>
  );
}