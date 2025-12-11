// src/components/ConfirmModal.tsx
import { ReactNode } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: ReactNode;
  iconBgColor: string;
  message: string;
  confirmText: string;
  confirmButtonColor: string;
  confirmButtonHoverColor: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  icon,
  iconBgColor,
  message,
  confirmText,
  confirmButtonColor,
  confirmButtonHoverColor
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {icon}
          </div>
          <p className="text-[#5F6368] mb-6" dangerouslySetInnerHTML={{ __html: message }} />
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-[#F5F7FA] text-[#5F6368] px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 ${confirmButtonColor} text-white px-6 py-3 rounded-lg ${confirmButtonHoverColor} transition-colors cursor-pointer`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
