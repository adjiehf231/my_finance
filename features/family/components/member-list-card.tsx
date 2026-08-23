"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Check, ShieldCheck, UserPlus, RefreshCw } from "lucide-react";
import { regenerateInviteCodeAction } from "../actions/family-actions";
import { toast } from "sonner";

interface MemberListCardProps {
  family: {
    id: string;
    name: string;
    invite_code: string;
  };
  currentUserRole: "owner" | "admin" | "member";
  members: Array<{
    id: string;
    role: string;
    joined_at: string;
    users: {
      id: string;
      email: string;
      full_name: string;
      avatar_url: string | null;
    };
  }>;
}

export function MemberListCard({
  family,
  currentUserRole,
  members,
}: MemberListCardProps) {
  const [copied, setCopied] = useState(false);
  const [inviteCode, setInviteCode] = useState(family.invite_code);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success("Kode undangan keluarga disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateCode = async () => {
    if (!confirm("Yakin ingin membuat kode undangan baru? Kode lama tidak akan berlaku lagi.")) return;
    try {
      setIsRegenerating(true);
      const res = await regenerateInviteCodeAction(family.id);
      if (res.success && res.data) {
        setInviteCode(res.data);
        toast.success("Kode undangan baru berhasil dibuat!");
      }
    } catch {
      toast.error("Gagal memperbarui kode undangan");
    } finally {
      setIsRegenerating(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Pemilik (Owner)</Badge>;
      case "admin":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Admin</Badge>;
      default:
        return <Badge variant="secondary">Anggota</Badge>;
    }
  };

  return (
    <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#131B2E] shadow-sm p-2 sm:p-4">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">
              Anggota Keluarga ({family.name})
            </CardTitle>
            <CardDescription className="mt-1">
              Semua anggota di bawah ini dapat melihat dan mencatat keuangan bersama.
            </CardDescription>
          </div>

          {/* Invite Code Box */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <UserPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Kode Undangan
              </span>
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white tracking-wider">
                {inviteCode}
              </span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              className="h-8 w-8 rounded-xl ml-1"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4 text-slate-500" />
              )}
            </Button>
            {currentUserRole === "owner" && (
              <Button
                size="icon"
                variant="ghost"
                disabled={isRegenerating}
                onClick={handleRegenerateCode}
                title="Ganti Kode Baru"
                className="h-8 w-8 rounded-xl"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-slate-400 ${isRegenerating ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {members.map((member) => (
            <div
              key={member.id}
              className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.users?.avatar_url || ""} />
                  <AvatarFallback>
                    {member.users?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {member.users?.full_name || "Pengguna"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {member.users?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getRoleBadge(member.role)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
