"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import {
  Activity,
  PlusCircle,
  ArrowRightLeft,
  PiggyBank,
  CheckCircle2,
  Trash2,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import type { ActivityLogItem } from "../actions/activity-actions";

interface ActivityFeedProps {
  logs: ActivityLogItem[];
}

export function ActivityFeed({ logs }: ActivityFeedProps) {
  if (logs.length === 0) {
    return (
      <Card className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
        <CardContent className="p-0 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <Activity className="h-7 w-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Belum Ada Riwayat Aktivitas
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Setiap mutasi transaksi, perubahan anggaran, dan pendaftaran anggota akan tercatat di sini secara transparan.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getActionIcon = (action: string, entity: string) => {
    if (entity === "transaction") return <PlusCircle className="h-4 w-4 text-emerald-600" />;
    if (entity === "family_member" || action === "join") return <UserPlus className="h-4 w-4 text-blue-600" />;
    if (entity === "goal" || entity === "goal_contribution") return <PiggyBank className="h-4 w-4 text-amber-600" />;
    if (action === "delete") return <Trash2 className="h-4 w-4 text-rose-600" />;
    return <Activity className="h-4 w-4 text-purple-600" />;
  };

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const userName = log.users?.full_name || "Anggota Keluarga";
        const userAvatar = log.users?.avatar_url;

        return (
          <Card
            key={log.id}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] p-4 shadow-sm hover:shadow-md transition-all"
          >
            <CardContent className="p-0 flex items-start gap-3.5">
              <Avatar className="h-10 w-10 rounded-2xl shrink-0 border border-slate-100 dark:border-slate-800">
                {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                <AvatarFallback className="rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {userName}
                  </p>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {log.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
