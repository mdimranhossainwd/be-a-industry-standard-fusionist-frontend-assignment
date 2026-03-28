import { NewsletterLog } from "@/app/admin/newsletter/_action";
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiErrorWarningLine,
  RiMailSendLine,
} from "react-icons/ri";

interface Props {
  logs: NewsletterLog[];
}

const statusConfig = {
  SUCCESS: {
    label: "Success",
    icon: RiCheckboxCircleLine,
    className: "text-emerald-700 bg-emerald-50",
  },
  PARTIAL: {
    label: "Partial",
    icon: RiErrorWarningLine,
    className: "text-amber-700 bg-amber-50",
  },
  FAILED: {
    label: "Failed",
    icon: RiCloseCircleLine,
    className: "text-red-700 bg-red-50",
  },
};

export default function NewsletterLogs({ logs }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <RiMailSendLine className="text-[#1a6b3c]" size={20} />
        <div>
          <h3 className="font-bold text-gray-900">Send History</h3>
          <p className="text-sm text-gray-400 mt-0.5">
            Last 20 newsletter sends
          </p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No newsletter sent yet
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {logs.map((log) => {
            const config =
              statusConfig[log.status as keyof typeof statusConfig] ??
              statusConfig.FAILED;

            return (
              <div
                key={log.id}
                className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold
                                px-2.5 py-1 rounded-full ${config.className}`}
                  >
                    <config.icon size={12} />
                    {config.label}
                  </span>

                  <div>
                    <p className="text-sm font-medium text-gray-700 line-clamp-1">
                      {log.subject}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(log.sentAt).toLocaleString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-gray-800">
                    {log.totalSent}
                  </p>
                  <p className="text-xs text-gray-400">sent</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
