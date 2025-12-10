// src/app/admin/create-module/page.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { mockRooms } from '@/data/mockData';
import { ArrowLeft, AlertCircle, Bluetooth } from 'lucide-react';

interface AddModuleProps {
  onLogout: () => void;
}

export default function AddModule({ onLogout }: AddModuleProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    moduleId: '',
    moduleName: '',
    roomId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    alert(`Module ${formData.moduleName} ajouté avec succès !`);
    navigate('/admin/modules');
  };

  return (
    <div className="min-h-screen bg-platinium">
      <Navbar role="admin" onLogout={onLogout} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/modules')}
          className="flex items-center gap-2 text-dim-gray hover:text-bondi-blue mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux modules</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-carbon-black mb-2">Ajouter un module IoT</h1>
          <p className="text-dim-gray">Configurez un nouveau capteur pour surveiller une salle</p>
        </div>

        {/* BLE Info Alert */}
        <div className="bg-alice-blue border-l-4 border-bondi-blue rounded-lg p-4 mb-6 flex items-start gap-3">
          <Bluetooth className="w-6 h-6 text-bondi-blue flex-shrink-0" />
          <div>
            <p className="text-carbon-black mb-1">Configuration BLE requise</p>
            <p className="text-dim-gray text-sm">
              Vous devez être physiquement proche du module pour la configuration initiale via Bluetooth Low Energy. 
              Assurez-vous que le module est allumé et en mode appairage.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-6">
            {/* Module ID */}
            <div>
              <label htmlFor="moduleId" className="block text-carbon-black mb-2">
                ID du module *
              </label>
              <input
                id="moduleId"
                type="text"
                value={formData.moduleId}
                onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bondi-blue focus:border-transparent"
                placeholder="Ex: module-7, IoT-G20-01"
                required
              />
              <p className="text-dim-gray text-sm mt-1">
                Identifiant unique du module (inscrit sur l&apos;appareil)
              </p>
            </div>

            {/* Module Name */}
            <div>
              <label htmlFor="moduleName" className="block text-carbon-black mb-2">
                Nom du module *
              </label>
              <input
                id="moduleName"
                type="text"
                value={formData.moduleName}
                onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bondi-bluefocus:border-transparent"
                placeholder="Ex: IoT-G20-01"
                required
              />
              <p className="text-dim-gray text-sm mt-1">
                Nom descriptif pour identifier le module
              </p>
            </div>

            {/* Room Assignment */}
            <div>
              <label htmlFor="roomId" className="block text-carbon-black mb-2">
                Salle à surveiller *
              </label>
              <select
                id="roomId"
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bondi-blue focus:border-transparent"
                required
              >
                <option value="">Sélectionner une salle</option>
                {mockRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
                <option value="new">+ Nouvelle salle</option>
              </select>
              <p className="text-dim-gray text-sm mt-1">
                Salle dans laquelle le module sera installé
              </p>
            </div>

            {/* Initial Configuration Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-carbon-black mb-4">Configuration initiale</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-bondi-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">1</span>
                  </div>
                  <p className="text-dim-gray">
                    Allumez le module et attendez le voyant bleu clignotant (mode appairage)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-bondi-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">2</span>
                  </div>
                  <p className="text-dim-gray">
                    Activez le Bluetooth sur votre appareil et approchez-vous du module
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-bondi-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">3</span>
                  </div>
                  <p className="text-dim-gray">
                    Après validation, le module se synchronisera automatiquement avec le serveur
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-bondi-blue text-white py-3 rounded-lg hover:bg-cerulean transition-colors cursor-pointer"
              >
                Ajouter le module
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/modules')}
                className="flex-1 border-2 border-gray-300 text-dim-gray py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-deep-saffron flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-carbon-black mb-2">Besoin d&apos;aide ?</h3>
              <p className="text-dim-gray text-sm">
                Si le module ne s&apos;appaire pas, vérifiez que le Bluetooth est activé et que vous êtes à moins de 5 mètres 
                du module. Pour plus d&apos;informations, consultez le guide d&apos;installation dans la documentation technique.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}