// src/app/admin/modules/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import { mockRooms } from '@/data/mockData';
import { ArrowLeft, AlertCircle, Bluetooth } from 'lucide-react';

export default function AddModule() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    moduleId: '',
    moduleName: '',
    roomId: ''
  });

  const onLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  const { notify } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    notify(`Module ${formData.moduleName} ajouté avec succès !`, "success");
    router.push("/admin/modules");
  };

  return (
    <>
      <title>Créer un module | Digital Campus</title>
      <meta name="description" content="Créer un module" />

      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar role="admin" onLogout={onLogout} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8" role="main">

          {/* Back Button */}
          <button
            onClick={() => router.push('/admin/modules')}
            className="flex items-center gap-2 text-[#5F6368] hover:text-[#0092bd] mb-6 transition-colors cursor-pointer"
            aria-label="Retour à la liste des modules"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span>Retour aux modules</span>
          </button>

          {/* Header */}
          <section role="region" aria-labelledby="add-module-header" className="mb-8">
            <h1 id="add-module-header" className="text-[#1A1A1A] mb-2">Ajouter un module IoT</h1>
            <p className="text-[#5F6368]">Configurez un nouveau capteur pour surveiller une salle</p>
          </section>

          {/* BLE Info Alert */}
          <div role="alert" className="bg-[#E3F2FD] border-l-4 border-[#0092bd] rounded-lg p-4 mb-6 flex items-start gap-3">
            <Bluetooth className="w-6 h-6 text-[#0092bd] shrink-0" aria-hidden="true" />
            <div>
              <p className="text-[#1A1A1A] mb-1 font-semibold">Configuration BLE requise</p>
              <p className="text-[#5F6368] text-sm">
                Vous devez être physiquement proche du module pour la configuration initiale via Bluetooth Low Energy.
                Assurez-vous que le module est allumé et en mode appairage.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8" aria-labelledby="form-add-module">
            <h2 id="form-add-module" className="sr-only">Formulaire de création du module</h2>

            <div className="space-y-6">

              {/* Module ID */}
              <div>
                <label htmlFor="moduleId" className="block text-[#1A1A1A] mb-2">ID du module *</label>
                <input
                  id="moduleId"
                  type="text"
                  value={formData.moduleId}
                  onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent"
                  placeholder="Ex: module-7, IoT-G20-01"
                  required
                  aria-required="true"
                />
                <p className="text-[#5F6368] text-sm mt-1">Identifiant unique du module (inscrit sur l'appareil)</p>
              </div>

              {/* Module Name */}
              <div>
                <label htmlFor="moduleName" className="block text-[#1A1A1A] mb-2">Nom du module *</label>
                <input
                  id="moduleName"
                  type="text"
                  value={formData.moduleName}
                  onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent"
                  placeholder="Ex: IoT-G20-01"
                  required
                  aria-required="true"
                />
                <p className="text-[#5F6368] text-sm mt-1">Nom descriptif pour identifier le module</p>
              </div>

              {/* Room Assignment */}
              <div>
                <label htmlFor="roomId" className="block text-[#1A1A1A] mb-2">Salle à surveiller *</label>
                <select
                  id="roomId"
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent"
                  required
                  aria-required="true"
                >
                  <option value="">Sélectionner une salle</option>
                  {mockRooms.map((room) => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                  ))}
                  <option value="new">+ Nouvelle salle</option>
                </select>
                <p className="text-[#5F6368] text-sm mt-1">Salle dans laquelle le module sera installé</p>
              </div>

              {/* Initial Configuration Steps */}
              <section role="region" aria-labelledby="initial-config-header" className="border-t border-gray-200 pt-6">
                <h3 id="initial-config-header" className="text-[#1A1A1A] mb-4">Configuration initiale</h3>
                <ol className="space-y-3 list-decimal list-inside">
                  <li>Allumez le module et attendez le voyant bleu clignotant (mode appairage)</li>
                  <li>Activez le Bluetooth sur votre appareil et approchez-vous du module</li>
                  <li>Après validation, le module se synchronisera automatiquement avec le serveur</li>
                </ol>
              </section>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-[#0092bd] text-white py-3 rounded-lg hover:bg-[#007a9d] transition-colors cursor-pointer"
                  aria-label="Ajouter le module"
                >
                  Ajouter le module
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/modules')}
                  className="flex-1 border-2 border-gray-300 text-[#5F6368] py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  aria-label="Annuler et revenir à la liste des modules"
                >
                  Annuler
                </button>
              </div>

            </div>
          </form>

          {/* Help Section */}
          <section role="region" aria-labelledby="help-section" className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 id="help-section" className="text-[#1A1A1A] mb-2">Besoin d'aide ?</h3>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF8F00] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[#5F6368] text-sm">
                Si le module ne s'appaire pas, vérifiez que le Bluetooth est activé et que vous êtes à moins de 5 mètres du module.
                Consultez la documentation technique pour plus d'informations.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
