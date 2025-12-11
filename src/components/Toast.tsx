// src/app/components/Toast.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextProps {
  notify: (msg: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);

    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}

      {/* Container positionné en bas à droite */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[9999]">
        {toasts.map((toast) => {
          let borderColor = "";
          let textColor = "";

          switch (toast.type) {
            case "success":
              borderColor = "border-[#00C853]";
              textColor = "text-[#00C853]";
              break;
            case "error":
              borderColor = "border-[#D50000]";
              textColor = "text-[#D50000]";
              break;
            case "info":
              borderColor = "border-[#0092bd]";
              textColor = "text-[#0092bd]";
              break;
          }

          return (
            <div
              key={toast.id}
              className={`
                px-4 py-3 rounded-lg shadow-lg min-w-[260px]
                border-2 ${borderColor} ${textColor} bg-white
                transition-all animate-slide-left
              `}
            >
              {toast.message}
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-left {
          animation: slide-left 0.25s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
