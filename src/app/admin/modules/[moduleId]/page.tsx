// src/app/admin/modules/[moduleId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import ConfirmModal from "@/components/ConfirmModal";
import { useToast } from "@/components/Toast";
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
import { fetchModuleById, fetchRooms, fetchModules, createModule, deleteModule } from "@/lib/api";

// Génération de données fictives historiques si nécessaire
const generateHistoricalData = (currentValue: number) => {
  const data = [];
  const now = new Date();
  for (let i = 10; i >= 0; i--) {
    data.push({
      time: new Date(now.getTime() - i * 60 * 1000).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: currentValue + Math.floor(Math.random() * 5 - 2),
    });
  }
  return data;
};

export default function AdminModuleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params?.moduleId as string | undefined;

  const { notify } = useToast();

  const [module, setModule] = useState<any | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState({
    name: "",
    roomId: "",
    acquisitionInterval: 30,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPowerModal, setShowPowerModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const onLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  // Charger le module et les salles
  useEffect(() => {
    const loadData = async () => {
      if (!moduleId) return;

      try {
        setLoading(true);
        const [moduleData, allRooms, modules] = await Promise.all([
          fetchModuleById(moduleId),
          fetchRooms(),
          fetchModules(),
        ]);
        setModule(moduleData);

        // Salles occupées par d'autres modules (hors module actuel)
        const occupiedRoomIds = modules
          .filter((m: any) => m.id !== moduleId)
          .map((m: any) => m.room?.id || m.room?._id)
          .filter(Boolean);

        // Ne garder que les salles libres + salle actuelle du module
        const availableRooms = allRooms.filter(
          (r: any) => r && (r._id || r.id) && (!occupiedRoomIds.includes(r._id || r.id) || r._id === moduleData.room?.id || r.id === moduleData.room?.id)
        );

        setRooms(availableRooms);

        setConfig({
          name: moduleData.name || "",
          roomId: moduleData.room?.id || moduleData.room?._id || "",
          acquisitionInterval: moduleData.acquisitionIntervalSec || 30,
        });
      } catch (err) {
        console.error(err);
        setError("Impossible de charger le module ou les salles.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du module...</p>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar role="admin" onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-[#5F6368] text-center">{error || "Module non trouvé"}</p>
        </div>
      </div>
    );
  }

  const room = rooms.find((r) => r.id === config.roomId || r._id === config.roomId);

  const tempData = generateHistoricalData(room?.temperature || 22);
  const co2Data = generateHistoricalData(room?.co2 || 400);

  const handleSave = async () => {
    if (!config.name || !config.roomId) {
      notify("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    try {
      setSaving(true);
      await createModule({
        hardwareId: module.id,
        name: config.name,
        roomId: config.roomId,
      });
      notify("Configuration du module mise à jour avec succès !", "success");
      // Mettre à jour localement le module
      setModule({ ...module, name: config.name, room: rooms.find(r => r.id === config.roomId || r._id === config.roomId) });
    } catch (err: any) {
      console.error(err);
      notify(err?.response?.data?.error || "Erreur lors de la mise à jour du module.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFirmwareUpdate = () => notify("Mise à jour du firmware lancée...", "success");
  const handlePowerToggle = () => setShowPowerModal(true);
  const handleSync = () => setShowSyncModal(true);

  const handleDelete = async () => {
    try {
      await deleteModule(module.id);

      notify("Module supprimé avec succès !", "success");

      router.push("/admin/modules");
    } catch (err: any) {
      console.error(err);
      notify("Erreur lors de la suppression du module.", "error");
    }
  };


  const confirmDelete = () => {
    setShowDeleteModal(false);
    handleDelete();
  };

  const confirmPowerToggle = () => {
    setShowPowerModal(false);
    notify(module.enabled ? "Module éteint" : "Module allumé", "success");
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
                <StatusBadge status={module.enabled ? "online" : "offline"} size="lg" aria-hidden="true" />
                <button
                  onClick={handlePowerToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${module.enabled ? "bg-[#D50000]" : "bg-[#00C853]"} text-white`}
                >
                  <Power className="w-4 h-4" aria-hidden="true" />
                  <span>{module.enabled ? "Éteindre" : "Allumer"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Main Content */}
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
                      aria-required="true"
                    >
                      <option value="">-- Sélectionner une salle --</option>
                      {rooms.map((r) => (
                        <option key={r._id || r.id} value={r._id || r.id}>
                          {r.name} — Étage {r.floor}
                        </option>
                      ))}
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
                    disabled={saving}
                    className="w-full bg-[#0092bd] text-white py-3 rounded-lg hover:bg-[#007a9d] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-5 h-5" aria-hidden="true" />
                    <span>{saving ? "Enregistrement..." : "Enregistrer la configuration"}</span>
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
                          <Line type="monotone" dataKey="value" stroke={room?.co2 > 1000 ? "#FF8F00" : "#0092bd"} strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-6" aria-label="Sidebar d'état du module et actions">
              {/* État du module */}
              <section aria-labelledby="module-status" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 id="module-status" className="text-[#1A1A1A] mb-6">État du module</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Battery className={`w-5 h-5 ${module.batteryPercent > 50 ? "text-[#00C853]" : module.batteryPercent > 20 ? "text-[#FF8F00]" : "text-[#D50000]"}`} aria-hidden="true" />
                      <span className="text-[#5F6368]">Batterie</span>
                    </div>
                    <span className={`${module.batteryPercent > 50 ? "text-[#00C853]" : module.batteryPercent > 20 ? "text-[#FF8F00]" : "text-[#D50000]"}`}>
                      {module.batteryPercent ?? "N/A"}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#5F6368]" aria-hidden="true" />
                      <span className="text-[#5F6368]">Dernière synchro</span>
                    </div>
                    <span className="text-[#1A1A1A] text-sm">{module.lastSeenAt ? new Date(module.lastSeenAt).toLocaleTimeString("fr-FR") : "N/A"}</span>
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
                    <span className="text-[#1A1A1A]">{room?.name || "Non assignée"}</span>
                  </div>
                </div>

                <button
                  onClick={handleSync}
                  className="w-full mt-6 border-2 border-[#0092bd] text-[#0092bd] py-2 rounded-lg hover:bg-[#0092bd] hover:text-white flex items-center justify-center gap-2"
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

          {/* Modals */}
          <ConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            icon={<Trash2 className="w-8 h-8 text-[#D50000]" />}
            iconBgColor="bg-[#FEE2E2]"
            message={`Êtes-vous sûr de vouloir supprimer le module <strong>${module.name}</strong> ?`}
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
            message={`Êtes-vous sûr de vouloir ${module.enabled ? "éteindre" : "allumer"} le module <strong>${module.name}</strong> ?`}
            confirmText={module.enabled ? "Éteindre" : "Allumer"}
            confirmButtonColor="bg-[#D50000]"
            confirmButtonHoverColor="hover:bg-[#B71C1C]"
          />

          <ConfirmModal
            isOpen={showSyncModal}
            onClose={() => setShowSyncModal(false)}
            onConfirm={confirmSync}
            icon={<RefreshCw className="w-8 h-8 text-[#0092bd]" />}
            iconBgColor="bg-[#E3F2FD]"
            message={`Êtes-vous sûr de vouloir forcer la synchronisation du module <strong>${module.name}</strong> ?`}
            confirmText="Synchroniser"
            confirmButtonColor="bg-[#0092bd]"
            confirmButtonHoverColor="hover:bg-[#007a9d]"
          />
        </div>
      </div>
    </>
  );
}
