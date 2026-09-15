"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    const result = await signIn(formData);
    if (result?.error) setError(result.error);
    setPending(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center">
      <form action={submit} className="w-full max-w-md space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-xl">
        <div>
          <p className="text-sm text-emerald-400">SiklusPangan</p>
          <h1 className="text-3xl font-bold">Masuk</h1>
          <p className="mt-1 text-slate-400">Gunakan email dan password akunmu.</p>
        </div>
        <label>Email<input name="email" type="email" autoComplete="email" required className="field" /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required className="field" /></label>
        <button disabled={pending} className="w-full rounded-xl bg-blue-600 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50">{pending ? "Masuk…" : "Masuk"}</button>
        {error && <p role="alert" className="rounded-lg bg-red-950 p-3 text-sm text-red-200">{error}</p>}
        <p className="text-center text-sm text-slate-400">Belum punya akun? <Link href="/signup" className="text-blue-400 hover:underline">Daftar</Link></p>
      </form>
    </main>
  );
}
