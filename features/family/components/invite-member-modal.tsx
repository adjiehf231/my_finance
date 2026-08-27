"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Mail,
  Share2,
  Link2,
  Copy,
  Check,
  Send,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface InviteMemberModalProps {
  familyId: string;
  familyName: string;
  inviteCode: string;
  triggerButton?: React.ReactNode;
}

export function InviteMemberModal({
  familyId,
  familyName,
  inviteCode,
  triggerButton,
}: InviteMemberModalProps) {
  const [open, setOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "member" | "viewer">("member");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const { t, locale } = useTranslation();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://my-finance.vercel.app";
  const joinUrl = `${baseUrl}/onboarding?invite=${inviteCode}`;

  const rawSubject = locale === "en"
    ? `Invitation to join "${familyName}" family workspace on My Finance`
    : `Undangan bergabung ke ruang kerja keluarga "${familyName}" di My Finance`;

  const inviteMessage = `Halo! Ayo bergabung ke ruang kerja keuangan keluarga kita "${familyName}" di My Finance.\n\nKlik tautan ini untuk bergabung langsung:\n${joinUrl}\n\nAtau gunakan kode undangan berikut: ${inviteCode}\n\nMari kita kelola keuangan keluarga bersama dengan transparan!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    toast.success(t("familyManagement.linkCopied"));
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(inviteMessage);
    setCopiedMsg(true);
    toast.success(t("familyManagement.msgCopied"));
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  // Direct Gmail Web Compose (Bypasses Chrome mailto blank page issue)
  const handleOpenGmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim() || !targetEmail.includes("@")) {
      toast.error(locale === "en" ? "Please enter a valid email address" : "Masukkan alamat email yang valid");
      return;
    }

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail.trim())}&su=${encodeURIComponent(rawSubject)}&body=${encodeURIComponent(inviteMessage)}`;
    window.open(gmailUrl, "_blank");
    toast.success(locale === "en" ? "Opening Gmail..." : "Membuka Gmail Web...");
  };

  // Default Mail App (mailto via window.location.href to avoid empty about:blank tab)
  const handleOpenDefaultMail = () => {
    if (!targetEmail.trim() || !targetEmail.includes("@")) {
      toast.error(locale === "en" ? "Please enter a valid email address" : "Masukkan alamat email yang valid");
      return;
    }

    const mailtoUrl = `mailto:${encodeURIComponent(targetEmail.trim())}?subject=${encodeURIComponent(rawSubject)}&body=${encodeURIComponent(inviteMessage)}`;
    window.location.href = mailtoUrl;
    toast.success(locale === "en" ? "Opening default mail app..." : "Membuka aplikasi email...");
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            size="sm"
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold gap-1.5 shadow-md shadow-blue-500/20 w-full sm:w-auto h-9"
          >
            <UserPlus className="h-4 w-4 shrink-0" />
            <span className="truncate">{t("familyManagement.inviteBtn")}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-24px)] sm:max-w-lg rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="truncate">{t("familyManagement.inviteModalTitle")}</span>
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed -mt-1">
          {t("familyManagement.inviteModalDesc")}
        </p>

        {/* Invite Code Highlight */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#07090E] border border-slate-200/80 dark:border-white/[0.08] my-1">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">
              {t("familyManagement.statsInviteCode")}
            </span>
            <span className="font-mono font-black text-sm sm:text-base text-slate-900 dark:text-white tracking-widest">
              {inviteCode}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            className="rounded-xl text-xs font-bold gap-1.5 h-8 px-3"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedLink ? "Disalin" : "Salin Link"}</span>
          </Button>
        </div>

        {/* Tab Selection */}
        <Tabs defaultValue="email" className="w-full mt-1">
          <TabsList className="grid grid-cols-3 rounded-2xl h-10 p-1 bg-slate-100 dark:bg-white/[0.04]">
            <TabsTrigger value="email" className="rounded-xl text-[11px] sm:text-xs font-bold gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0E131F]">
              <Mail className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="truncate">Email / Gmail</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="rounded-xl text-[11px] sm:text-xs font-bold gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0E131F]">
              <Smartphone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{t("familyManagement.waTab")}</span>
            </TabsTrigger>
            <TabsTrigger value="link" className="rounded-xl text-[11px] sm:text-xs font-bold gap-1 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0E131F]">
              <Link2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">{t("familyManagement.linkTab")}</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Email & Direct Gmail */}
          <TabsContent value="email" className="space-y-3 pt-2">
            <form onSubmit={handleOpenGmail} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="invite-email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("familyManagement.targetEmailLabel")}
                </Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="pasangan@email.com / anak@email.com"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  className="h-10 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#07090E]/70 text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t("familyManagement.targetRoleLabel")}
                </Label>
                <Select
                  value={selectedRole}
                  onValueChange={(val: any) => setSelectedRole(val)}
                >
                  <SelectTrigger className="h-10 rounded-2xl border-slate-200 dark:border-white/[0.08] text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="admin" className="text-xs font-medium">
                      Administrator — {locale === "en" ? "Manage records & budgets" : "Kelola mutasi & anggaran"}
                    </SelectItem>
                    <SelectItem value="member" className="text-xs font-medium">
                      Member — {locale === "en" ? "Record income & expense" : "Catat pemasukan & pengeluaran"}
                    </SelectItem>
                    <SelectItem value="viewer" className="text-xs font-medium">
                      Viewer — {locale === "en" ? "Read-only access" : "Hanya melihat laporan"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Primary: 1-Click Open in Gmail Web */}
              <Button
                type="submit"
                className="w-full h-11 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold gap-2 shadow-md shadow-red-500/20"
              >
                <Mail className="h-4 w-4" />
                <span>Buka & Kirim di Gmail Web</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-80 ml-auto" />
              </Button>

              {/* Secondary actions: Copy Email Message or Open default mail */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyMessage}
                  className="flex-1 rounded-2xl text-xs font-bold h-9 gap-1.5 border-slate-200 dark:border-white/[0.08]"
                >
                  {copiedMsg ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Salin Pesan</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleOpenDefaultMail}
                  className="flex-1 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white h-9"
                  title="Gunakan aplikasi email default di perangkat"
                >
                  App Email Default
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* TAB 2: WhatsApp */}
          <TabsContent value="whatsapp" className="space-y-3 pt-2">
            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5" />
                {locale === "en" ? "Ready-to-send WhatsApp invitation" : "Pesan undangan WhatsApp siap kirim"}
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-black/30 p-2.5 rounded-xl border border-slate-200/50 dark:border-white/[0.04] font-mono break-all sm:break-normal">
                {inviteMessage}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyMessage}
                className="w-full sm:flex-1 rounded-2xl text-xs font-bold h-10 gap-2"
              >
                {copiedMsg ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {t("familyManagement.copyInviteMsgBtn")}
              </Button>
              <Button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full sm:flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-10 gap-2 shadow-md shadow-emerald-500/20"
              >
                <Send className="h-4 w-4" />
                {t("familyManagement.openWhatsAppBtn")}
              </Button>
            </div>
          </TabsContent>

          {/* TAB 3: Direct Link */}
          <TabsContent value="link" className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {locale === "en" ? "Direct Join URL" : "Tautan Langsung Bergabung"}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={joinUrl}
                  className="h-10 rounded-2xl border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-[#07090E]/70 text-xs font-mono select-all truncate"
                />
                <Button
                  type="button"
                  onClick={handleCopyLink}
                  className="h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-3.5 shrink-0"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
              {locale === "en"
                ? "Anyone with this link can automatically join your family workspace after logging in."
                : "Siapapun yang membuka tautan ini akan langsung otomatis masuk ke ruang kerja keluarga Anda setelah login."}
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
