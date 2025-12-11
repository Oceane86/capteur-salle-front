// src/app/admin/modules/[moduleId]/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/components/Toast";
import { mockModules, mockRooms, generateHistoricalData } from "@/data/mockData";
import {
  ArrowLeft,
  Save,
  Power,
  RefreshCw,
  Download,
  Battery,
  Clock,
  MapPin,
  Signal,
  Thermometer,
  Wind,
  Trash2,
  Droplets,
  Sun,
  Volume2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminModuleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params?.moduleId as string | undefined;

  const onLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  const module = useMemo(() => mockModules.find((m) => m.id === moduleId), [moduleId]);
  const room = useMemo(() => (module ? mockRooms.find((r) => r.id === module.roomId) : null), [module]);

  const [config, setConfig] = useState({
    name: module?.name || "",
    roomId: module?.roomId || "",
    acquisitionInterval: module?.acquisitionInterval || 30,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPowerModal, setShowPowerModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  if (!module || !room) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar role="admin" onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-[#5F6368] text-center">Module non trouvé</p>
        </div>
      </div>
    );
  }

  const tempData = generateHistoricalData(room.temperature);
  const co2Data = generateHistoricalData(room.co2);

  const { notify } = useToast();

  const handleSave = () => {
    notify("Configuration enregistrée avec succès !", "success");
  };

  const handleFirmwareUpdate = () => {
    notify("Mise à jour du firmware lancée...", "success");
  };

  const handlePowerToggle = () => setShowPowerModal(true);
  const handleSync = () => setShowSyncModal(true);

  const handleDelete = () => {
    notify("Module supprimé avec succès !", "error");
    router.push("/admin/modules");
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    handleDelete();
  };

  const confirmPowerToggle = () => {
    setShowPowerModal(false);
    notify(module.status === "online" ? "Module éteint" : "Module allumé", "success");
  };

  const confirmSync = () => {
    setShowSyncModal(false);
    notify("Synchronisation forcée démarrée...", "info");
  };

  return (
    <>
      <title>Détails du module | Digital Campus</title>
      <meta name="description" content="Détails du module" />

      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar role="admin" onLogout={onLogout} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Back Button */}
          <button
            onClick={() => router.push("/admin/modules")}
            className="flex items-center gap-2 text-[#5F6368] hover:text-[#0092bd] mb-6 transition-colors cursor-pointer"
            aria-label="Retour aux modules"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span>Retour aux modules</span>
          </button>

          {/* Module header */}
          <section aria-labelledby="module-header" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 id="module-header" className="text-[#1A1A1A] mb-2">{module.name}</h1>
                <p className="text-[#5F6368]">ID: {module.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={module.status as any} size="lg" aria-hidden="true" />
                <button
                  onClick={handlePowerToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${module.status === "online" ? "bg-[#D50000] text-white hover:bg-[#B71C1C]" : "bg-[#00C853] text-white hover:bg-[#00A844]"}`}
                  aria-label={module.status === "online" ? "Éteindre le module" : "Allumer le module"}
                >
                  <Power className="w-4 h-4" aria-hidden="true" />
                  <span>{module.status === "online" ? "Éteindre" : "Allumer"}</span>
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left/Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Configuration générale */}
              <section aria-labelledby="config-general" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 id="config-general" className="text-[#1A1A1A] mb-6">Configuration générale</h2>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="moduleName" className="block text-[#1A1A1A] mb-2">Nom du module</label>
                    <input
                      id="moduleName"
                      type="text"
                      value={config.name}
                      onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent"
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="roomAssignment" className="block text-[#1A1A1A] mb-2">Salle assignée</label>
                    <select
                      id="roomAssignment"
                      value={config.roomId}
                      onChange={(e) => setConfig({ ...config, roomId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent"
                      size={5}
                      aria-required="true"
                    >
                      {mockRooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="acquisitionInterval" className="block text-[#1A1A1A] mb-2">Intervalle d'acquisition</label>
                    <select
                      id="acquisitionInterval"
                      value={config.acquisitionInterval}
                      onChange={(e) => setConfig({ ...config, acquisitionInterval: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd] focus:border-transparent"
                      aria-required="true"
                    >
                      <option value={10}>10 secondes</option>
                      <option value={30}>30 secondes</option>
                      <option value={60}>1 minute</option>
                      <option value={300}>5 minutes</option>
                      <option value={600}>10 minutes</option>
                    </select>
                    <p className="text-[#5F6368] text-sm mt-1">Fréquence à laquelle le module collecte les données</p>
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full bg-[#0092bd] text-white py-3 rounded-lg hover:bg-[#007a9d] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-5 h-5" aria-hidden="true" />
                    <span>Enregistrer la configuration</span>
                  </button>
                </div>
              </section>

              {/* Firmware */}
              <section aria-labelledby="firmware-update" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 id="firmware-update" className="text-[#1A1A1A] mb-4">Mise à jour du firmware</h2>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[#5F6368]">Version actuelle</p>
                    <p className="text-[#1A1A1A]">v{module.firmwareVersion}</p>
                  </div>
                  <div>
                    <p className="text-[#5F6368]">Dernière version</p>
                    <p className="text-[#00C853]">v2.3.1</p>
                  </div>
                </div>
                <button
                  onClick={handleFirmwareUpdate}
                  disabled={module.firmwareVersion === "2.3.1"}
                  className="w-full bg-[#00C853] text-white py-3 rounded-lg hover:bg-[#00A844] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  aria-disabled={module.firmwareVersion === "2.3.1"}
                >
                  <Download className="w-5 h-5" aria-hidden="true" />
                  <span>{module.firmwareVersion === "2.3.1" ? "Firmware à jour" : "Mettre à jour (OTA)"}</span>
                </button>
              </section>

              {/* Historical Data */}
              <section aria-labelledby="historical-data" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 id="historical-data" className="text-[#1A1A1A] mb-6">Historique des mesures</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-[#1A1A1A] mb-4">Température</h3>
                    <div className="w-full h-[200px]">
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
                  </div>

                  <div>
                    <h3 className="text-[#1A1A1A] mb-4">CO₂</h3>
                    <div className="w-full h-[200px]">
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={co2Data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                          <XAxis dataKey="time" stroke="#5F6368" />
                          <YAxis stroke="#5F6368" />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke={room.co2 > 1000 ? "#FF8F00" : "#0092bd"} strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6" aria-label="Sidebar d'état du module et actions">
              <section aria-labelledby="module-status" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 id="module-status" className="text-[#1A1A1A] mb-6">État du module</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Battery className={`w-5 h-5 ${module.batteryLevel > 50 ? "text-[#00C853]" : module.batteryLevel > 20 ? "text-[#FF8F00]" : "text-[#D50000]"}`} aria-hidden="true" />
                      <span className="text-[#5F6368]">Batterie</span>
                    </div>
                    <span className={`${module.batteryLevel > 50 ? "text-[#00C853]" : module.batteryLevel > 20 ? "text-[#FF8F00]" : "text-[#D50000]"}`}>{module.batteryLevel}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#5F6368]" aria-hidden="true" />
                      <span className="text-[#5F6368]">Dernière synchro</span>
                    </div>
                    <span className="text-[#1A1A1A] text-sm">{new Date(module.lastSync).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Signal className="w-5 h-5 text-[#5F6368]" aria-hidden="true" />
                      <span className="text-[#5F6368]">Signal</span>
                    </div>
                    <span className="text-[#00C853]">Excellent</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#5F6368]" aria-hidden="true" />
                      <span className="text-[#5F6368]">Salle</span>
                    </div>
                    <span className="text-[#1A1A1A]">{room.name}</span>
                  </div>
                </div>

                <button
                  onClick={handleSync}
                  className="w-full mt-6 border-2 border-[#0092bd] text-[#0092bd] py-2 rounded-lg hover:bg-[#0092bd] hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  aria-label="Forcer la synchronisation du module"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  <span>Forcer la synchronisation</span>
                </button>
              </section>

              {/* Mesures actuelles */}
              <section aria-labelledby="current-measures" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 id="current-measures" className="text-[#1A1A1A] mb-6">Mesures actuelles</h2>
                <div className="space-y-4">
                  {[
                    { label: "Température", value: `${room.temperature}°C`, icon: <Thermometer className="w-5 h-5 text-[#0092bd]" aria-hidden="true" /> },
                    { label: "CO₂", value: `${room.co2} ppm`, icon: <Wind className="w-5 h-5 text-[#0092bd]" aria-hidden="true" /> },
                    { label: "Humidité", value: `${room.humidity}%`, icon: <Droplets className="w-5 h-5 text-[#0092bd]" aria-hidden="true" /> },
                    { label: "Luminosité", value: `${room.brightness} lux`, icon: <Sun className="w-5 h-5 text-[#0092bd]" aria-hidden="true" /> },
                    { label: "Son", value: `${room.noise} dB`, icon: <Volume2 className="w-5 h-5 text-[#0092bd]" aria-hidden="true" /> },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {m.icon}
                        <span className="text-[#5F6368]">{m.label}</span>
                      </div>
                      <span className="text-[#1A1A1A]">{m.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Danger Zone */}
              <section aria-labelledby="danger-zone" className="bg-white rounded-xl shadow-sm border-2 border-[#D50000] p-6">
                <h2 className="text-[#D50000] mb-4">Zone de danger</h2>
                <p className="text-[#5F6368] text-sm mb-4">La suppression du module est définitive et entraînera la perte de toutes les données associées.</p>
                <button onClick={() => setShowDeleteModal(true)} className="w-full bg-[#D50000] text-white py-2 rounded-lg hover:bg-[#B71C1C] transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer le module</span>
                </button>
              </section>
            </aside>
          </div>
        </div>

        {/* Modals */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          icon={<Trash2 className="w-8 h-8 text-[#D50000]" />}
          iconBgColor="bg-[#FEE2E2]"
          message={`Êtes-vous sûr de vouloir supprimer le module <strong>${module.name}</strong> ?<br />Cette action est <strong>irréversible</strong> et entraînera la perte de toutes les données associées.`}
          confirmText="Supprimer"
          confirmButtonColor="bg-[#D50000]"
          confirmButtonHoverColor="hover:bg-[#B71C1C]"
        />

        <ConfirmModal
          isOpen={showPowerModal}
          onClose={() => setShowPowerModal(false)}
          onConfirm={confirmPowerToggle}
          icon={<Power className="w-8 h-8 text-[#D50000]" />}
          iconBgColor="bg-[#FEE2E2]"
          message={`Êtes-vous sûr de vouloir ${module.status === "online" ? "éteindre" : "allumer"} le module <strong>${module.name}</strong> ?<br />Cette action peut affecter la collecte des données en temps réel.`}
          confirmText={module.status === "online" ? "Éteindre" : "Allumer"}
          confirmButtonColor="bg-[#D50000]"
          confirmButtonHoverColor="hover:bg-[#B71C1C]"
        />

        <ConfirmModal
          isOpen={showSyncModal}
          onClose={() => setShowSyncModal(false)}
          onConfirm={confirmSync}
          icon={<RefreshCw className="w-8 h-8 text-[#0092bd]" />}
          iconBgColor="bg-[#E3F2FD]"
          message={`Êtes-vous sûr de vouloir forcer la synchronisation du module <strong>${module.name}</strong> ?<br />Cette action va actualiser immédiatement toutes les données du capteur.`}
          confirmText="Synchroniser"
          confirmButtonColor="bg-[#0092bd]"
          confirmButtonHoverColor="hover:bg-[#007a9d]"
        />
      </div>
    </>
  );
}
