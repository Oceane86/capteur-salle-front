// src/app/admin/create-module/page.tsx
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import ConfirmModal from '@/components/ConfirmModal';
import { mockModules, mockRooms } from '@/data/mockData';
import { 
  Plus, 
  Settings, 
  Edit, 
  MapPin, 
  Clock, 
  Power, 
  RefreshCw,
  Battery,
  Signal
} from 'lucide-react';

interface ModuleManagementProps {
  onLogout: () => void;
}

export default function ModuleManagement({ onLogout }: ModuleManagementProps) {
  const navigate = useNavigate();
  const [showPowerModal, setShowPowerModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const getRoomName = (roomId: string) => {
    return mockRooms.find(r => r.id === roomId)?.name || 'Non assignée';
  };

  const handlePowerToggle = (module: any) => {
    setSelectedModule(module);
    setShowPowerModal(true);
  };

  const handleSync = (module: any) => {
    setSelectedModule(module);
    setShowSyncModal(true);
  };

  const confirmPowerToggle = () => {
    setShowPowerModal(false);
    alert(selectedModule.status === 'online' ? 'Module éteint' : 'Module allumé');
  };

  const confirmSync = () => {
    setShowSyncModal(false);
    alert('Synchronisation forcée démarrée...');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar role="admin" onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-[#1A1A1A] mb-2">Gestion des modules IoT</h1>
            <p className="text-[#5F6368]">Administrez tous les capteurs et modules du campus</p>
          </div>
          <button
            onClick={() => navigate('/admin/modules/add')}
            className="flex items-center gap-2 bg-[#0092bd] text-white px-6 py-3 rounded-lg hover:bg-[#007a9d] transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter un module</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-[#5F6368] mb-1">Modules en ligne</p>
            <p className="text-[#1A1A1A] text-3xl">
              {mockModules.filter(m => m.status === 'online').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-[#5F6368] mb-1">Modules hors ligne</p>
            <p className="text-[#1A1A1A] text-3xl">
              {mockModules.filter(m => m.status === 'offline').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <p className="text-[#5F6368] mb-1">Total modules</p>
            <p className="text-[#1A1A1A] text-3xl">{mockModules.length}</p>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {mockModules.map((module) => (
            <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Module Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-[#1A1A1A]">{module.name}</h3>
                    <StatusBadge status={module.status} size="sm" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* Room Assignment */}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#5F6368]" />
                      <div>
                        <p className="text-[#5F6368] text-xs">Salle assignée</p>
                        <p className="text-[#1A1A1A]">{getRoomName(module.roomId)}</p>
                      </div>
                    </div>

                    {/* Acquisition Interval */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#5F6368]" />
                      <div>
                        <p className="text-[#5F6368] text-xs">Intervalle</p>
                        <p className="text-[#1A1A1A]">{module.acquisitionInterval}s</p>
                      </div>
                    </div>

                    {/* Battery Level */}
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-[#5F6368]" />
                      <div>
                        <p className="text-[#5F6368] text-xs">Batterie</p>
                        <p className={`${
                          module.batteryLevel > 50 ? 'text-[#00C853]' : 
                          module.batteryLevel > 20 ? 'text-[#FF8F00]' : 'text-[#D50000]'
                        }`}>
                          {module.batteryLevel}%
                        </p>
                      </div>
                    </div>

                    {/* Firmware */}
                    <div className="flex items-center gap-2">
                      <Signal className="w-4 h-4 text-[#5F6368]" />
                      <div>
                        <p className="text-[#5F6368] text-xs">Firmware</p>
                        <p className="text-[#1A1A1A]">v{module.firmwareVersion}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[#5F6368] text-sm mt-3">
                    Dernière synchro : {new Date(module.lastSync).toLocaleString('fr-FR')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/admin/modules/${module.id}`)}
                    className="flex items-center gap-2 bg-[#0092bd] text-white px-4 py-2 rounded-lg hover:bg-[#007a9d] transition-colors text-sm cursor-pointer"
                    title="Configurer"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Configurer</span>
                  </button>
                  
                  <button
                    onClick={() => handlePowerToggle(module)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer ${
                      module.status === 'online'
                        ? 'bg-[#D50000] text-white hover:bg-[#D50000]'
                        : 'bg-[#00C853] text-white hover:bg-[#00A844]'
                    }`}
                    title={module.status === 'online' ? 'Éteindre' : 'Allumer'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleSync(module)}
                    className="flex items-center gap-2 bg-[#F5F7FA] text-[#5F6368] px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm cursor-pointer"
                    title="Forcer la synchronisation"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Power Modal */}
      {selectedModule && (
        <ConfirmModal
          isOpen={showPowerModal}
          onClose={() => setShowPowerModal(false)}
          onConfirm={confirmPowerToggle}
          icon={<Power className="w-8 h-8 text-[#D50000]" />}
          iconBgColor="bg-[#FEE2E2]"
          message={`Êtes-vous sûr de vouloir ${selectedModule.status === 'online' ? 'éteindre' : 'allumer'} le module <strong>${selectedModule.name}</strong> ?<br />Cette action peut affecter la collecte des données en temps réel.`}
          confirmText={selectedModule.status === 'online' ? 'Éteindre' : 'Allumer'}
          confirmButtonColor="bg-[#D50000]"
          confirmButtonHoverColor="hover:bg-[#D50000]"
        />
      )}

      {/* Sync Modal */}
      {selectedModule && (
        <ConfirmModal
          isOpen={showSyncModal}
          onClose={() => setShowSyncModal(false)}
          onConfirm={confirmSync}
          icon={<RefreshCw className="w-8 h-8 text-[#0092bd]" />}
          iconBgColor="bg-alice-blue"
          message={`Êtes-vous sûr de vouloir forcer la synchronisation du module <strong>${selectedModule.name}</strong> ?<br />Cette action va actualiser immédiatement toutes les données du capteur.`}
          confirmText="Synchroniser"
          confirmButtonColor="bg-[#0092bd]"
          confirmButtonHoverColor="hover:bg-[#007a9d]"
        />
      )}
    </div>
  );
}