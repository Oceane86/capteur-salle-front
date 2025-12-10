// src/app/student/room-details/page.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Thermometer, Droplets, Wind, Sun, Volume2, AlertCircle, Calendar, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import ReservationModal from '@/components/ReservationModal';
import { mockRooms, generateHistoricalData } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RoomDetailsProps {
  onLogout: () => void;
}

export default function RoomDetails({ onLogout }: RoomDetailsProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const room = mockRooms.find(r => r.id === roomId);

  if (!room) {
    return (
      <div className="min-h-screen bg-platinium">
        <Navbar role="student" onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-dim-gray text-center">Salle non trouvée</p>
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
    
    if (score >= 80) return { label: 'Excellent', color: 'bg-jade-green' };
    if (score >= 60) return { label: 'Bon', color: 'bg-radioactive-grass' };
    if (score >= 40) return { label: 'Moyen', color: 'bg-deep-saffron' };
    return { label: 'Faible', color: 'bg-brick-ember' };
  };

  const handleReservation = (data: { startTime: string; endTime: string; reason: string }) => {
    console.log('Réservation:', { roomId: room.id, ...data });
    setIsModalOpen(false);
    // TODO: Ici, on enverrait les données à l'API
  };

  const comfortIndex = getComfortIndex();
  const tempData = generateHistoricalData(room.temperature);
  const co2Data = generateHistoricalData(room.co2);

  return (
    <div className="min-h-screen bg-platinium">
      <Navbar role="student" onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/student')}
          className="flex items-center gap-2 text-dim-gray hover:text-bondi-blue mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux salles</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <h1 className="text-carbon-black mb-2">{room.name}</h1>
              <p className="text-dim-gray">Dernière mise à jour : il y a 2 minutes</p>
            </div>
            <div className="flex items-center gap-3">
              {room.needsAiring && (
                <AlertTriangle className="w-6 h-6 text-deep-saffron" />
              )}
              <StatusBadge status={room.status} size="lg" />
              {room.status === 'available' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-bondi-blue text-white px-4 py-2 rounded-lg hover:bg-cerulean transition-colors cursor-pointer"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Réserver</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alert for high CO2 */}
        {room.needsAiring && (
          <div className="bg-old-lace border-l-4 border-deep-saffron rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-deep-saffron flex-shrink-0" />
            <div>
              <p className="text-deep-saffron mb-1">Aération nécessaire</p>
              <p className="text-dim-gray text-sm">
                Le niveau de CO₂ est élevé ({room.co2} ppm). Il est recommandé d&apos;aérer la pièce.
              </p>
            </div>
          </div>
        )}

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Temperature */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-platinium rounded-lg p-3">
                <Thermometer className="w-6 h-6 text-bondi-blue" />
              </div>
              <div>
                <p className="text-dim-gray">Température</p>
                <p className="text-carbon-black text-2xl">{room.temperature}°C</p>
              </div>
            </div>
            <div className="h-16 min-h-16">
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
              <div className="bg-platinium rounded-lg p-3">
                <Droplets className="w-6 h-6 text-bondi-blue" />
              </div>
              <div>
                <p className="text-dim-gray">Humidité</p>
                <p className="text-carbon-black text-2xl">{room.humidity}%</p>
              </div>
            </div>
            <div className="pt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-bondi-blue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${room.humidity}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* CO2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-platinium rounded-lg p-3">
                <Wind className="w-6 h-6 text-bondi-blue" />
              </div>
              <div>
                <p className="text-dim-gray">CO₂</p>
                <p className="text-carbon-black text-2xl">{room.co2} ppm</p>
              </div>
            </div>
            <div className="h-16 min-h-16">
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
              <div className="bg-platinium rounded-lg p-3">
                <Sun className="w-6 h-6 text-bondi-blue" />
              </div>
              <div>
                <p className="text-dim-gray">Luminosité</p>
                <p className="text-carbon-black text-2xl">{room.brightness} lux</p>
              </div>
            </div>
          </div>

          {/* Noise */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="bg-platinium rounded-lg p-3">
                <Volume2 className="w-6 h-6 text-bondi-blue" />
              </div>
              <div>
                <p className="text-dim-gray">Niveau sonore</p>
                <p className="text-carbon-black text-2xl">{room.noise} dB</p>
              </div>
            </div>
          </div>

          {/* Comfort Index */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className={`${comfortIndex.color} rounded-lg p-3`}>
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-dim-gray">Indice de confort</p>
                <p className="text-carbon-black text-2xl">{comfortIndex.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Historical Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-carbon-black mb-4">Évolution de la température</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="time" stroke="#5F6368" />
                <YAxis stroke="#5F6368" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0092bd" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* CO2 Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-carbon-black mb-4">Évolution du CO₂</h3>
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reservation Modal */}
        <ReservationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          roomName={room.name}
          onReserve={handleReservation}
        />
      </div>
    </div>
  );
}