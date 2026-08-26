"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/i18n-context";
import {
  History,
  PlusCircle,
  Edit,
  Trash2,
  Scale,
  UserPlus,
  Search,
  Receipt,
  Wallet,
  PieChart,
  CreditCard,
  Target,
  Users,
} from "lucide-react";
import type { ActivityLogItem } from "../actions/activity-actions";

interface ActivityLogViewProps {
  initialLogs: ActivityLogItem[];
  totalCount: number;
}

export function ActivityLogView({ initialLogs, totalCount }: ActivityLogViewProps) {
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedEntity, setSelectedEntity] = useState("all");
  const { t, locale } = useTranslation();

  const filteredLogs = initialLogs.filter((log) => {
    if (selectedAction !== "all" && log.action !== selectedAction) return false;
    if (selectedEntity !== "all" && log.entity !== selectedEntity) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const desc = (log.description || "").toLowerCase();
      const actor = (log.users?.full_name || "").toLowerCase();
      if (!desc.includes(q) && !actor.includes(q)) return false;
    }
    return true;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
            <PlusCircle className="h-3 w-3 mr-1" /> {t("activity.createAction")}
          </Badge>
        );
      case "update":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[10px] font-bold">
            <Edit className="h-3 w-3 mr-1" /> {t("activity.updateAction")}
          </Badge>
        );
      case "delete":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-bold">
            <Trash2 className="h-3 w-3 mr-1" /> {t("activity.deleteAction")}
          </Badge>
        );
      case "reconcile":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-bold">
            <Scale className="h-3 w-3 mr-1" /> {t("activity.reconcileAction")}
          </Badge>
        );
      case "join":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold">
            <UserPlus className="h-3 w-3 mr-1" /> {t("activity.joinAction")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-bold">
            {action}
          </Badge>
        );
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case "transaction":
        return <Receipt className="h-4 w-4 text-blue-500" />;
      case "wallet":
        return <Wallet className="h-4 w-4 text-emerald-500" />;
      case "budget":
        return <PieChart className="h-4 w-4 text-purple-500" />;
      case "debt":
        return <CreditCard className="h-4 w-4 text-rose-500" />;
      case "goal":
        return <Target className="h-4 w-4 text-cyan-500" />;
      case "family":
      case "family_member":
        return <Users className="h-4 w-4 text-indigo-500" />;
      default:
        return <History className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder={t("activity.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-2xl h-11 bg-slate-50/80 dark:bg-[#07090E]/80 border-slate-200/80 dark:border-white/[0.08] text-xs font-medium"
            />
          </div>

          {/* Action Filter */}
          <div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full h-11 px-3.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#07090E]/80 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              <option value="all">{t("activity.allActions")}</option>
              <option value="create">{t("activity.createAction")}</option>
              <option value="update">{t("activity.updateAction")}</option>
              <option value="delete">{t("activity.deleteAction")}</option>
              <option value="reconcile">{t("activity.reconcileAction")}</option>
              <option value="join">{t("activity.joinAction")}</option>
            </select>
          </div>

          {/* Entity Filter */}
          <div>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full h-11 px-3.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#07090E]/80 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              <option value="all">{t("activity.allEntities")}</option>
              <option value="transaction">{t("activity.txEntity")}</option>
              <option value="wallet">{t("activity.walletEntity")}</option>
              <option value="budget">{t("activity.budgetEntity")}</option>
              <option value="debt">{t("activity.debtEntity")}</option>
              <option value="goal">{t("activity.goalEntity")}</option>
              <option value="family_member">{t("activity.memberEntity")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2">
            <History className="h-4 w-4 text-blue-500" />
            {t("activity.auditTitle", { count: filteredLogs.length, total: totalCount })}
          </h3>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs font-medium">
            {t("activity.empty")}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-[#07090E] border border-slate-200/60 dark:border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    {getEntityIcon(log.entity)}
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {log.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-medium text-slate-500 dark:text-slate-300">
                        {log.users?.full_name || (locale === "en" ? "System" : "Sistem")}
                      </span>
                      <span>•</span>
                      <span className="font-mono">
                        {new Date(log.created_at).toLocaleString(locale === "en" ? "en-US" : "id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="self-start sm:self-auto shrink-0">
                  {getActionBadge(log.action)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
