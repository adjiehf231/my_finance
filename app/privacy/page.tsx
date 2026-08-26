import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, FileText, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | My Finance",
  description: "Kebijakan Privasi dan Perlindungan Data Pribadi My Finance sesuai UU PDP No. 27 Tahun 2022.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Halaman Masuk
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
                Kebijakan Privasi (Privacy Policy)
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Terakhir Diperbarui: Agustus 2026 • Kepatuhan UU PDP No. 27 Tahun 2022
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-500" />
              1. Komitmen Privasi & Keamanan Data
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>My Finance</strong> berkomitmen penuh untuk menjaga kerahasiaan dan privasi data finansial keluarga Anda. Seluruh pemrosesan data pribadi pada platform ini tunduk pada ketentuan <strong>Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              2. Data yang Kami Kumpulkan
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Kami hanya mengumpulkan data yang esensial untuk pengoperasian sistem pencatatan keuangan keluarga Anda:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300 ml-2">
              <li><strong>Informasi Akun (Google OAuth):</strong> Nama lengkap, alamat email, dan foto profil publik untuk identitas masuk pengguna.</li>
              <li><strong>Data Transaksi Finansial:</strong> Catatan pemasukan, pengeluaran, anggaran, dompet, target tabungan, dan hutang/piutang yang Anda masukkan secara sukarela.</li>
              <li><strong>Bukti Transaksi (Struk):</strong> Foto struk belanja yang Anda unggah secara eksplisit untuk dipindai oleh fitur OCR.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              3. Penggunaan Data Google OAuth
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Akses Google OAuth kami hanya meminta izin dasar (<em>email, profile, openid</em>). Data ini:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300 ml-2">
              <li><strong>TIDAK PERNAH</strong> dijual, disewakan, atau dibagikan ke pihak ketiga untuk keperluan periklanan atau pemasaran.</li>
              <li><strong>HANYA</strong> digunakan untuk otentikasi login sesi dan menghubungkan akun Anda ke ruang kerja keluarga yang sah.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-500" />
              4. Perlindungan & Isolasi Data (PostgreSQL RLS)
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Setiap catatan keuangan diisolasi pada level basis data menggunakan <strong>PostgreSQL Row Level Security (RLS)</strong>. Hanya anggota keluarga terdaftar dengan izin akses sah yang dapat melihat atau mengubah catatan keluarga terkait. Seluruh komunikasi jaringan diamankan dengan protokol <strong>HTTPS / TLS 1.3</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              5. Hak Portabilitas & Penghapusan Data Pengguna
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Sesuai amanat UU PDP, Anda memiliki hak penuh atas data Anda:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300 ml-2">
              <li><strong>Portabilitas Data:</strong> Unduh seluruh data keluarga kapan saja dalam format terbuka CSV atau JSON Takeout melalui menu Pengaturan.</li>
              <li><strong>Penghapusan Data (Right to be Forgotten):</strong> Anda berhak menghapus akun beserta seluruh data transaksi keluarga secara permanen dari sistem kami.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-slate-100 dark:border-white/[0.06] pt-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              6. Kontak & Pengaduan Privasi
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau ingin mengajukan permintaan terkait data pribadi Anda, silakan hubungi tim pengembang kami melalui email:
            </p>
            <p className="font-mono font-bold text-blue-600 dark:text-blue-400">
              adjieharifajar2301@gmail.com
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
