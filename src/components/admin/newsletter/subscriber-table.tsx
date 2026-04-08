"use client";

import {
  unsubscribeAction,
  verifySubscriberAction,
  type Subscriber,
} from "@/app/admin/newsletter/_action";
import { useState, useTransition } from "react";
import {
  RiCheckboxCircleLine,
  RiDeleteBinLine,
  RiGlobalLine,
  RiSearchLine,
  RiShieldCheckLine,
  RiTimeLine,
  RiUserLine,
} from "react-icons/ri";

interface Props {
  subscribers: Subscriber[];
}

export default function SubscriberTable({ subscribers }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">(
    "all",
  );
  const [actionId, setActionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = subscribers.filter((s) => {
    const matchSearch =
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.user?.name ?? "").toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all"
        ? true
        : filter === "verified"
          ? s.isVerified
          : !s.isVerified;

    return matchSearch && matchFilter;
  });

  const handleVerify = (email: string, id: string) => {
    setActionId(id);
    startTransition(async () => {
      await verifySubscriberAction(email);
      setActionId(null);
    });
  };

  const handleDelete = (email: string, id: string) => {
    if (!confirm(`Remove ${email} from newsletter?`)) return;
    setActionId(id);
    startTransition(async () => {
      await unsubscribeAction(email);
      setActionId(null);
    });
  };

  const filterTabs: { key: typeof filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "verified", label: "Verified" },
    { key: "unverified", label: "Unverified" },
  ];

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-textPrimary text-lg">Subscribers</h3>
          <p className="text-sm text-textSecondary mt-0.5">
            {subscribers.length} total subscribers
          </p>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 border border-gray-200 dark:border-gray-800
                        rounded-full px-4 py-2 w-full sm:w-[260px]"
        >
          <RiSearchLine
            className="text-textSecondary flex-shrink-0"
            size={15}
          />
          <input
            type="text"
            placeholder="Search email or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-textPrimary outline-none
                       placeholder:text-textSecondary w-full"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-6 pt-4 flex gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
              ${
                filter === tab.key
                  ? "bg-[#1a6b3c] text-white"
                  : "bg-bgSecondary text-textSecondary hover:bg-muted/50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                Subscriber
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                Type
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                Subscribed
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-textSecondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-12 text-textSecondary text-sm"
                >
                  No subscribers found
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-gray-50/50 transition-colors duration-150"
                >
                  {/* Email + name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-emerald-50 flex items-center
                                      justify-center flex-shrink-0"
                      >
                        <RiUserLine className="text-emerald-600" size={14} />
                      </div>
                      <div>
                        <p className="font-medium text-textPrimary">
                          {sub.email}
                        </p>
                        {sub.user?.name && (
                          <p className="text-xs text-textSecondary mt-0.5">
                            {sub.user.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Member / Guest */}
                  <td className="px-6 py-4">
                    {sub.userId ? (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold
                                       text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full"
                      >
                        <RiUserLine size={11} /> Member
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold
                                       text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full"
                      >
                        <RiGlobalLine size={11} /> Guest
                      </span>
                    )}
                  </td>

                  {/* Verified status */}
                  <td className="px-6 py-4">
                    {sub.isVerified ? (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold
                                       text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full"
                      >
                        <RiCheckboxCircleLine size={12} /> Verified
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold
                                       text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full"
                      >
                        <RiTimeLine size={12} /> Pending
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-textSecondary text-xs">
                    {new Date(sub.subscribedAt).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Verify button — শুধু unverified এর জন্য */}
                      {!sub.isVerified && (
                        <button
                          onClick={() => handleVerify(sub.email, sub.id)}
                          disabled={isPending && actionId === sub.id}
                          title="Verify subscriber"
                          className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100
                                     flex items-center justify-center text-emerald-600
                                     transition-all duration-200 disabled:opacity-50"
                        >
                          <RiShieldCheckLine size={15} />
                        </button>
                      )}

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(sub.email, sub.id)}
                        disabled={isPending && actionId === sub.id}
                        title="Remove subscriber"
                        className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100
                                   flex items-center justify-center text-red-500
                                   transition-all duration-200 disabled:opacity-50"
                      >
                        <RiDeleteBinLine size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
