"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export default function SignupPage() {
  const [role, setRole] = useState("beneficiary");
  const [organization, setOrganization] = useState("individual");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setMessage("");
    const result = await signUp(formData);
    setMessage(result.success ? result.message ?? "Berhasil" : result.error ?? "Gagal membuat akun");
    setPending(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center">
      <form action={submit} className="w-full max-w-xl space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-xl">
        <div><p className="text-sm text-emerald-400">SiklusPangan</p><h1 className="text-3xl font-bold">Buat akun</h1><p className="text-slate-400 mt-1">Lengkapi data untuk mulai menggunakan platform.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>Nama lengkap<input name="displayName" required className="field" /></label>
          <label>Email<input name="email" type="email" required className="field" /></label>
          <label>Password<input name="password" type="password" minLength={8} required className="field" /></label>
          <label>Nomor telepon<input name="phoneNumber" required className="field" /></label>
        </div>
        <label>Alamat<textarea name="address" required className="field min-h-20" /></label>
        <label>Daftar sebagai<select name="role" value={role} onChange={(e) => setRole(e.target.value)} className="field"><option value="beneficiary">Penerima manfaat</option><option value="donor">Donatur</option><option value="processor">Pengolah limbah</option></select></label>
        {role === "beneficiary" && <fieldset className="space-y-3"><legend className="font-semibold">Tipe penerima manfaat</legend><div className="flex gap-5"><label className="inline-flex gap-2"><input type="radio" name="isOrganization" value="individual" checked={organization === "individual"} onChange={() => setOrganization("individual")} />Perorangan</label><label className="inline-flex gap-2"><input type="radio" name="isOrganization" value="organization" checked={organization === "organization"} onChange={() => setOrganization("organization")} />Organisasi</label></div>{organization === "organization" && <label>Jumlah anggota/kapasitas<input name="organizationCapacity" type="number" min="1" required className="field" /></label>}</fieldset>}
        <button disabled={pending} className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50">{pending ? "Membuat akun…" : "Daftar"}</button>
        {message && <p role="status" className="rounded-lg bg-slate-800 p-3 text-sm">{message}</p>}
        <p className="text-center text-sm text-slate-400">Sudah punya akun? <Link href="/login" className="text-blue-400 hover:underline">Masuk</Link></p>
      </form>
    </main>
  );
}
