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
        <h3 className="text-carbon-black">{room.name}</h3>
        <div className="flex items-center gap-2">
          {room.needsAiring && (
            <AlertTriangle className="w-5 h-5 text-deep-saffron" />
          )}
          <StatusBadge status={room.status} size="sm" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="flex items-center gap-2">
          <div className="bg-platinium rounded-lg p-2">
            <Thermometer className="w-4 h-4 text-bondi-blue" />
          </div>
          <div>
            <p className="text-dim-gray text-xs">Température</p>
            <p className="text-carbon-black">{room.temperature}°C</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center gap-2">
          <div className="bg-platinium rounded-lg p-2">
            <Droplets className="w-4 h-4 text-bondi-blue" />
          </div>
          <div>
            <p className="text-dim-gray text-xs">Humidité</p>
            <p className="text-carbon-black">{room.humidity}%</p>
          </div>
        </div>

        {/* CO2 */}
        <div className="flex items-center gap-2">
          <div className="bg-platinium rounded-lg p-2">
            <Wind className="w-4 h-4 text-bondi-blue" />
          </div>
          <div>
            <p className="text-dim-gray text-xs">CO₂</p>
            <p className="text-carbon-black">{room.co2} ppm</p>
          </div>
        </div>

        {/* Brightness */}
        <div className="flex items-center gap-2">
          <div className="bg-platinium rounded-lg p-2">
            <Sun className="w-4 h-4 text-bondi-blue" />
          </div>
          <div>
            <p className="text-dim-gray text-xs">Luminosité</p>
            <p className="text-carbon-black">{room.brightness} lux</p>
          </div>
        </div>
      </div>

      {/* Warning for high CO2 */}
      {room.needsAiring && (
        <div className="mt-4 bg-old-lace border border-deep-saffron rounded-lg p-3 flex items-start gap-2">
          <Wind className="w-4 h-4 text-deep-saffron mt-0.5 flex-shrink-0" />
          <p className="text-deep-saffron text-sm">
            Niveau de CO₂ élevé. Aération recommandée.
          </p>
        </div>
      )}
    </div>
  );
}