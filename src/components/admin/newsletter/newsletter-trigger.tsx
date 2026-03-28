"use client";

import { triggerNewsletterAction } from "@/app/admin/newsletter/_action";
import { useState } from "react";
import { RiCheckLine, RiLoader4Line, RiSendPlaneLine } from "react-icons/ri";

export default function TriggerNewsletter() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleTrigger = async () => {
    setLoading(true);
    setMessage("");

    const result = await triggerNewsletterAction();

    setLoading(false);
    setIsSuccess(result.success);
    setMessage(result.message);

    // 4 সেকেন্ড পরে message সরাও
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="bg-gradient-to-br from-[#0f1a14] to-[#1a3326] rounded-2xl p-6 text-white">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2">
            📬 Newsletter Blast
          </p>
          <h3 className="text-xl font-bold text-white mb-1">
            Send to All Verified Subscribers
          </h3>
          <p className="text-sm text-white/50 max-w-sm">
            This will send the top 5 highlighted & most-voted ideas to every
            verified subscriber immediately.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            onClick={handleTrigger}
            disabled={loading}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400
                       disabled:bg-green-900 disabled:cursor-not-allowed
                       text-white font-semibold text-sm px-6 py-3 rounded-full
                       transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            {loading ? (
              <>
                <RiLoader4Line className="animate-spin" size={16} />
                Sending...
              </>
            ) : (
              <>
                <RiSendPlaneLine size={16} />
                Send Newsletter
              </>
            )}
          </button>

          {message && (
            <p
              className={`text-xs font-medium flex items-center gap-1.5 ${
                isSuccess ? "text-green-400" : "text-red-400"
              }`}
            >
              {isSuccess && <RiCheckLine size={14} />}
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
