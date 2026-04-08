import NewsletterLogs from "@/components/admin/newsletter/newsletter-logs";
import NewsletterStats from "@/components/admin/newsletter/newsletter-state";
import TriggerNewsletter from "@/components/admin/newsletter/newsletter-trigger";
import SubscriberTable from "@/components/admin/newsletter/subscriber-table";
import { RiLeafLine } from "react-icons/ri";
import { getNewsletterLogsAction, getSubscribersAction } from "./_action";

export default async function AdminNewsletterPage() {
  const [subscribersData, logsData] = await Promise.all([
    getSubscribersAction(),
    getNewsletterLogsAction(),
  ]);

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 bg-[#1a6b3c] dark:bg-[#1a6b3c] rounded-xl flex items-center justify-center">
            <RiLeafLine className="text-white" size={18} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Newsletter Management
          </h1>
        </div>
        <p className="text-gray-500 text-sm ml-[52px]">
          Manage subscribers and send fortnightly eco-idea digests
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <NewsletterStats meta={subscribersData.meta} logs={logsData.logs} />
      </div>

      {/* Trigger */}
      <div className="mb-6">
        <TriggerNewsletter />
      </div>

      {/* Table + Logs side by side on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">
        <SubscriberTable subscribers={subscribersData.subscribers} />
        <NewsletterLogs logs={logsData.logs} />
      </div>
    </div>
  );
}
