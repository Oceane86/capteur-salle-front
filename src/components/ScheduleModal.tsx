// src/components/ScheduleModal.tsx
import { X } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  reservations: { startTime: string; endTime: string; reason: string }[];
}

export default function ScheduleModal({ isOpen, onClose, roomName, reservations }: ScheduleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay with blur */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-[#1A1A1A]">Planning de {roomName}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer le planning"
          >
            <X className="w-5 h-5 text-[#5F6368]" />
          </button>
        </div>

        {/* Reservations List */}
        {reservations.length === 0 ? (
          <p className="text-[#5F6368] text-center">Aucune réservation pour aujourd'hui.</p>
        ) : (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {reservations.map((res, idx) => (
              <li key={idx} className="p-3 bg-[#F5F7FA] rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-[#1A1A1A] font-medium">{res.reason}</p>
                  <p className="text-[#5F6368] text-sm">{res.startTime} - {res.endTime}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
