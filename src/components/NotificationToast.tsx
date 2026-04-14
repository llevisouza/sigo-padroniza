import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { motion } from "motion/react";
import { NotificationState } from "../types/AppUi";

type NotificationToastProps = {
  notification: NotificationState;
  onClose: () => void;
};

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  if (!notification) {
    return null;
  }

  return (
    <motion.div
      key={`notification-${notification.message}`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed bottom-8 right-8 z-50 flex items-center rounded-2xl border px-6 py-4 shadow-2xl ${
        notification.type === "success"
          ? "border-green-200 bg-green-50 text-green-800"
          : notification.type === "error"
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-blue-200 bg-blue-50 text-blue-800"
      }`}
    >
      {notification.type === "success" && <CheckCircle2 className="mr-3 h-5 w-5 text-green-600" />}
      {notification.type === "error" && <AlertCircle className="mr-3 h-5 w-5 text-red-600" />}
      {notification.type === "info" && <Info className="mr-3 h-5 w-5 text-blue-600" />}
      <span className="text-sm font-bold">{notification.message}</span>
      <button onClick={onClose} className="ml-4 rounded-full p-1 hover:bg-black/5">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
