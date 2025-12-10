// src/app/admin/create-module/page.tsx
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { mockRooms, mockModules, mockAlerts } from '@/data/mockData';
import { Settings, Bell, Activity, AlertTriangle, Thermometer } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const navigate = useNavigate();

  const avgTemp = (mockRooms.reduce((acc, room) => acc + room.temperature, 0) / mockRooms.length).toFixed(1);
  const avgCO2 = Math.round(mockRooms.reduce((acc, room) => acc + room.co2, 0) / mockRooms.length);
  const occupancyRate = ((mockRooms.filter(r => r.status === 'occupied').length / mockRooms.length) * 100).toFixed(0);
  const onlineModules = mockModules.filter(m => m.status === 'online').length;
  const offlineModules = mockModules.filter(m => m.status === 'offline').length;

  return (
    <div className="min-h-screen bg-platinium">
      <Navbar role="admin" onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-carbon-black mb-2">Dashboard administrateur</h1>
          <p className="text-dim-gray">Vue d&apos;ensemble du campus IoT</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Average Temperature */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-dim-gray">Température moyenne</p>
              <div className="bg-platinium rounded-lg p-2">
                <Thermometer className="w-5 h-5 text-bondi-blue" />
              </div>
            </div>
            <p className="text-carbon-black text-3xl">{avgTemp}°C</p>
          </div>

          {/* Average CO2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-dim-gray">CO₂ moyen</p>
              <div className="bg-platinium rounded-lg p-2">
                <Bell className="w-5 h-5 text-bondi-blue" />
              </div>
            </div>
            <p className="text-carbon-black text-3xl">{avgCO2} ppm</p>
          </div>

          {/* Occupancy Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-dim-gray">Taux d&apos;occupation</p>
              <div className="bg-platinium rounded-lg p-2">
                <Activity className="w-5 h-5 text-bondi-blue" />
              </div>
            </div>
            <p className="text-carbon-black text-3xl">{occupancyRate}%</p>
          </div>

          {/* Modules Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-dim-gray">Modules IoT</p>
              <div className="bg-platinium rounded-lg p-2">
                <Settings className="w-5 h-5 text-bondi-blue" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-jade-green" />
                <span className="text-carbon-black text-2xl">{onlineModules}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-brick-ember" />
                <span className="text-carbon-black text-2xl">{offlineModules}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Building Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-carbon-black">Plan du bâtiment</h2>
                <button
                  onClick={() => navigate('/admin/modules/add')}
                  className="flex items-center gap-2 bg-bondi-blue text-white px-4 py-2 rounded-lg hover:bg-cerulean transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                  <span>Ajouter un module</span>
                </button>
              </div>

              {/* Légende */}
              <div className="flex items-center gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-jade-green"></div>
                  <span className="text-dim-gray text-sm">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-brick-ember"></div>
                  <span className="text-dim-gray text-sm">Occupée</span>
                </div>
              </div>
              
              {/* Simple Grid Layout */}
              <div className="bg-platinium rounded-lg p-4 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                  {mockRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => navigate(`/admin/modules/${room.moduleId}`)}
                      className={`
                        aspect-square rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center cursor-pointer relative
                        transition-all duration-200 hover:scale-105 hover:shadow-md
                        ${room.status === 'available' ? 'bg-jade-green' : ''}
                        ${room.status === 'occupied' ? 'bg-brick-ember' : ''}
                      `}
                    >
                      {room.needsAiring && (
                        <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                      )}
                      <p className="text-white text-center mb-1 text-xs sm:text-base">{room.name}</p>
                      <p className="text-white text-[10px] sm:text-xs opacity-90">{room.temperature}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-carbon-black mb-6">Dernières alertes</h2>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="border-l-4 border-deep-saffron bg-old-lace rounded-r-lg p-4">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-deep-saffron flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-carbon-black mb-1">{alert.roomName}</p>
                      <p className="text-dim-gray text-sm break-words">{alert.message}</p>
                      <p className="text-dim-gray text-xs mt-2">
                        {new Date(alert.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin/modules')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-platinium rounded-lg p-3 group-hover:bg-bondi-blue transition-colors">
                <Activity className="w-6 h-6 text-bondi-blue group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-carbon-black mb-1">Gérer les modules</h3>
                <p className="text-dim-gray text-sm">Voir et configurer tous les modules IoT</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/modules/add')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-platinium rounded-lg p-3 group-hover:bg-jade-green transition-colors">
                <Settings className="w-6 h-6 text-jade-green group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-carbon-black mb-1">Ajouter un module</h3>
                <p className="text-dim-gray text-sm">Configurer un nouveau capteur IoT</p>
              </div>
            </div>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-platinium rounded-lg p-3">
                <Bell className="w-6 h-6 text-deep-saffron" />
              </div>
              <div>
                <h3 className="text-carbon-black mb-1">Alertes actives</h3>
                <p className="text-dim-gray text-sm">{mockAlerts.length} alertes en cours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}