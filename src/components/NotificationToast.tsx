import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { NotificationState } from "../types/AppUi";

type NotificationToastProps = {
  notification: NotificationState;
  onClose: () => void;
};

const toneByType = {
  success: {
    container: "border-emerald-200 bg-white text-slate-900",
    icon: "text-emerald-600",
  },
  error: {
    container: "border-rose-200 bg-white text-slate-900",
    icon: "text-rose-600",
  },
  info: {
    container: "border-blue-200 bg-white text-slate-900",
    icon: "text-blue-600",
  },
} as const;

export function NotificationToast({ notification, onClose }: NotificationToastProps) {
  if (!notification) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 w-[min(440px,calc(100vw-2rem))]">
      <div
        className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_18px_40px_rgba(15,23,42,0.12)] ${toneByType[notification.type].container}`}
      >
        {notification.type === "success" && <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${toneByType.success.icon}`} />}
        {notification.type === "error" && <AlertCircle className={`mt-0.5 h-5 w-5 shrink-0 ${toneByType.error.icon}`} />}
        {notification.type === "info" && <Info className={`mt-0.5 h-5 w-5 shrink-0 ${toneByType.info.icon}`} />}

        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-relaxed text-slate-600">{notification.message}</p>
        </div>

        <button onClick={onClose} className="rounded-xl p-1.5 text-current/60 transition-colors duration-150 hover:bg-slate-100 hover:text-current">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
