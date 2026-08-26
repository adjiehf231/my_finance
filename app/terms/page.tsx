import { Metadata } from "next";
import Link from "next/link";
import { FileCheck, ArrowLeft, Shield, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | My Finance",
  description: "Syarat dan Ketentuan Layanan Penggunaan Aplikasi My Finance.",
};

export default function TermsOfServicePage() {
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
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
                Syarat & Ketentuan Layanan (Terms of Service)
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Terakhir Diperbarui: Agustus 2026 • Platform My Finance
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              1. Penerimaan Ketentuan
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Dengan mengakses dan menggunakan aplikasi <strong>My Finance</strong>, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan Layanan ini. Jika Anda tidak menyetujui ketentuan ini, Anda disarankan untuk tidak menggunakan platform ini.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              2. Deskripsi Layanan
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              My Finance adalah perangkat lunak manajemen dan pencatatan finansial keluarga modern yang menyediakan fitur pembukuan transaksi, alokasi anggaran bulanan, target tabungan, pelacakan hutang/piutang, analisis arus kas, serta pemindaian struk berbasis AI.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              3. Akun Pengguna & Keamanan
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Pengguna bertanggung jawab penuh atas keamanan akun Google yang digunakan untuk otentikasi masuk ke platform ini. Segala aktivitas yang terjadi di bawah akun Anda merupakan tanggung jawab Anda secara pribadi.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              4. Batasan Tanggung Jawab
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Fitur AI Financial Advisor dan kalkulator keuangan yang disediakan pada platform ini bertujuan sebagai alat bantu estimasi dan wawasan, bukan merupakan nasihat keuangan legal atau investasi profesional resmi. Pengguna tetap bertanggung jawab penuh atas segala keputusan finansial yang diambil.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-100 dark:border-white/[0.06] pt-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              5. Hubungi Kami
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Untuk pertanyaan lebih lanjut mengenai ketentuan layanan ini, silakan hubungi tim dukungan kami di:
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
