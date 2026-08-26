"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Check,
  UserPlus,
  RefreshCw,
  MoreVertical,
  Shield,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  regenerateInviteCodeAction,
  updateMemberRoleAction,
  removeMemberAction,
} from "../actions/family-actions";
import { ROLE_DEFINITIONS, canManageMembers, type FamilyRole } from "@/lib/auth/rbac";
import { toast } from "sonner";

interface MemberListCardProps {
  family: {
    id: string;
    name: string;
    invite_code: string;
  };
  currentUserRole: FamilyRole;
  currentUserId?: string;
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
  currentUserId,
  members,
}: MemberListCardProps) {
  const [copied, setCopied] = useState(false);
  const [inviteCode, setInviteCode] = useState(family.invite_code);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

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

  const handleRoleChange = async (userId: string, newRole: FamilyRole) => {
    try {
      setUpdatingUserId(userId);
      const res = await updateMemberRoleAction({
        familyId: family.id,
        userId,
        role: newRole,
      });

      if (res.success) {
        toast.success(`Hak akses anggota berhasil diubah ke ${ROLE_DEFINITIONS[newRole]?.label || newRole}!`);
      } else {
        toast.error(res.error || "Gagal mengubah hak akses");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRemoveMember = async (userId: string, memberName: string) => {
    if (!confirm(`Keluarkan ${memberName} dari keluarga?`)) return;
    try {
      setUpdatingUserId(userId);
      const res = await removeMemberAction({
        familyId: family.id,
        userId,
      });

      if (res.success) {
        toast.success(`${memberName} berhasil dikeluarkan dari keluarga`);
      } else {
        toast.error(res.error || "Gagal mengeluarkan anggota");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <Card className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#0D111A]/85 backdrop-blur-2xl shadow-sm p-4 sm:p-6">
      <CardHeader className="p-0 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-black font-display text-slate-900 dark:text-white">
              Daftar Anggota & Hak Akses ({family.name})
            </CardTitle>
            <CardDescription className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Kelola peran hak akses anggota ruang kerja keluarga (Owner, Admin, Member, Viewer).
            </CardDescription>
          </div>

          {/* Invite Code Box */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#07090E] px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-white/[0.08]">
            <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[9px] uppercase font-black tracking-widest font-display">
                Kode Undangan
              </span>
              <span className="font-mono font-black text-sm text-slate-900 dark:text-white tracking-widest">
                {inviteCode}
              </span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              className="h-8 w-8 rounded-xl ml-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            {currentUserRole === "owner" && (
              <Button
                size="icon"
                variant="ghost"
                disabled={isRegenerating}
                onClick={handleRegenerateCode}
                title="Ganti Kode Baru"
                className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
          {members.map((member) => {
            const role = (member.role || "member") as FamilyRole;
            const roleDef = ROLE_DEFINITIONS[role] || ROLE_DEFINITIONS.member;
            const isSelf = currentUserId === member.users?.id;
            const isOwner = role === "owner";
            const canEdit = canManageMembers(currentUserRole) && !isOwner && !isSelf;

            return (
              <div
                key={member.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3.5">
                  <Avatar className="h-11 w-11 rounded-2xl border border-slate-200/80 dark:border-white/[0.08]">
                    <AvatarImage src={member.users?.avatar_url || ""} />
                    <AvatarFallback className="bg-blue-600/10 text-blue-600 font-bold">
                      {member.users?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                      {member.users?.full_name || "Pengguna"}
                      {isSelf && (
                        <span className="text-[10px] bg-slate-100 dark:bg-white/[0.08] text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full font-sans font-bold">
                          Anda
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {member.users?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {canEdit ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          disabled={updatingUserId === member.users?.id}
                          className={`text-xs font-black px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${roleDef.badgeClass}`}
                        >
                          <Shield className="h-3 w-3" />
                          <span>{roleDef.label}</span>
                          <ChevronDown className="h-3 w-3 opacity-60" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl shadow-2xl border border-slate-200 dark:border-white/[0.08]">
                        {(["admin", "member", "viewer"] as FamilyRole[]).map((r) => (
                          <DropdownMenuItem
                            key={r}
                            onClick={() => handleRoleChange(member.users.id, r)}
                            className="text-xs font-bold cursor-pointer"
                          >
                            {ROLE_DEFINITIONS[r].label}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.users.id, member.users.full_name || "Anggota")}
                          className="text-xs font-bold text-rose-600 focus:text-rose-700 cursor-pointer border-t border-slate-100 dark:border-white/[0.06] mt-1 pt-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Keluarkan dari Keluarga
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Badge className={`text-xs font-bold px-3 py-1 rounded-xl border ${roleDef.badgeClass}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {roleDef.label}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
