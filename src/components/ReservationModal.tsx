// src/components/ReservationModal.tsx
import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  roomName: string;
  onClose: () => void;
  onReserve: (data: { startTime: string; endTime: string; reason: string }) => void;
}

export default function ReservationModal({ isOpen, roomName, onClose, onReserve }: ReservationModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startTime || !endTime || !reason) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    // Vérifier que si "Autre" est sélectionné, le motif personnalisé est rempli
    if (reason === 'Autre' && !customReason.trim()) {
      setError('Veuillez préciser le motif');
      return;
    }

    // Vérifier que l'heure de fin est après l'heure de début
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    if (end <= start) {
      setError('L\'heure de fin doit être après l\'heure de début');
      return;
    }

    const finalReason = reason === 'Autre' ? customReason : reason;
    onReserve({ startTime, endTime, reason: finalReason });
    // Réinitialiser le formulaire
    setStartTime('');
    setEndTime('');
    setReason('');
    setCustomReason('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-[#1A1A1A]">Réserver {roomName}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-[#5F6368]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Start Time */}
          <div>
            <label className="block text-[#5F6368] mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Heure de début
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              min="09:00"
              max="21:00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd]"
              required
            />
            <p className="text-[#5F6368] text-sm mt-1">L&apos;école est ouverte de 9h à 21h</p>
          </div>

          {/* End Time */}
          <div>
            <label className="block text-[#5F6368] mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Heure de fin
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              min="09:00"
              max="21:00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd]"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[#5F6368] mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Motif
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd]"
              required
            >
              <option value="">Sélectionnez un motif</option>
              <option value="Cours">Cours</option>
              <option value="TD">TD</option>
              <option value="TP">TP</option>
              <option value="Réunion">Réunion</option>
              <option value="Projet">Projet</option>
              <option value="Étude en groupe">Étude en groupe</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* Custom Reason */}
          {reason === 'Autre' && (
            <div>
              <label className="block text-[#5F6368] mb-2">
                Motif personnalisé
              </label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0092bd]"
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-[#5F6368] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#0092bd] text-white rounded-lg hover:bg-[#007a9d] transition-colors cursor-pointer"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}