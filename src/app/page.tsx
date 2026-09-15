import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Recycle, Award } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Subtle Gradient Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[350px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full text-center space-y-8 z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <span>SiklusPangan — Vibe Code TCC 2026 UTM</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-50 leading-tight">
          Penyelamatan Pangan &amp; <br />
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Biokonversi Limbah Organik
          </span>
        </h1>

        {/* Description */}
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Mengintegrasikan rantai pasok sirkular dari hulu ke hilir: Penyelamatan makanan berlebih (*Surplus Food Rescue*) dan biokonversi sisa makanan basi berbasis insentif logistik terbalik (*Reverse Tipping Fee*).
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
          <div className="glass-panel p-6 rounded-2xl hover:border-blue-500/40 transition-all cursor-pointer group">
            <ShieldCheck className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-slate-100">Surplus Food Rescue</h3>
            <p className="text-slate-400 text-sm mt-1">Pemindai VLM Gemini &amp; Live Radar Surplus Food aman konsumsi.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-emerald-500/40 transition-all cursor-pointer group">
            <Recycle className="w-8 h-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-slate-100">Biokonversi Limbah</h3>
            <p className="text-slate-400 text-sm mt-1">Pengolahan sisa makanan basi ke maggot BSF &amp; peternak via QR Code.</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-teal-500/40 transition-all cursor-pointer group">
            <Award className="w-8 h-8 text-teal-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-slate-100">Analitik Dampak ESG</h3>
            <p className="text-slate-400 text-sm mt-1">Kalkulator reduksi emisi metana ($CH_4$) &amp; sertifikat ESG digital.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/rescue"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            <span>Jelajahi Radar Surplus</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/wall-of-fame"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold transition-all"
          >
            <span>Wall of Fame Donatur</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
