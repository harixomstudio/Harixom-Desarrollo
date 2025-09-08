import  { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className={`
            fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white
            ${toast.type === "success" ? "bg-gradient-to-r from-pink-500 to-blue-500" : ""}
            ${toast.type === "error" ? "bg-gradient-to-r from-red-500 to-pink-500" : ""}
            ${toast.type === "info" ? "bg-gradient-to-r from-blue-500 to-pink-400" : ""}
            animate-fade-in
          `}
        >
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}