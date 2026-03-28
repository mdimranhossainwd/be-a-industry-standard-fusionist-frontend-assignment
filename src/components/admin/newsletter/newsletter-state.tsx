import type {
  NewsletterLog,
  SubscriberMeta,
} from "@/app/admin/newsletter/_action";
import { RiSendPlaneLine } from "react-icons/ri";

interface Props {
  meta: SubscriberMeta;
  logs: NewsletterLog[];
}

export default function NewsletterStats({ meta, logs }: Props) {
  const lastSent = logs[0]?.sentAt
    ? new Date(logs[0].sentAt).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Never";

  const stats = [
    {
      label: "Last Sent",
      value: lastSent,
      icon: RiSendPlaneLine,
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
      border: "border-violet-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`${s.bg} ${s.border} border rounded-2xl p-5 flex items-start gap-4`}
        >
          <div className={`${s.iconColor} mt-0.5`}>
            <s.icon size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
              {s.label}
            </p>
            <p className="text-2xl font-bold text-gray-800 leading-none">
              {s.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
