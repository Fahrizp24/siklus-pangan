"use server";

import { createClient } from "@/lib/supabase/server";
import { signupSchema } from "@/lib/auth/signup-schema";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const parsed = signupSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    phoneNumber: formData.get("phoneNumber"),
    address: formData.get("address"),
    role: formData.get("role"),
    isOrganization: formData.get("isOrganization") === "organization",
    organizationCapacity: formData.get("organizationCapacity")
      ? Number(formData.get("organizationCapacity"))
      : undefined,
  });

  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid" };

  const data = parsed.data;
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.displayName,
        role: data.role,
        phone_number: data.phoneNumber,
        address: data.address,
        is_organization: data.isOrganization,
        organization_capacity: data.isOrganization ? data.organizationCapacity : null,
      },
    },
  });

  if (error) return { success: false, error: error.message };
  return {
    success: true,
    needsConfirmation: !authData.session,
    message: authData.session ? "Akun berhasil dibuat." : "Cek email untuk konfirmasi akun.",
  };
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { success: false, error: "Email dan password wajib diisi" };

  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !authData.user) return { success: false, error: error?.message ?? "Login gagal" };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();
  if (profileError) return { success: false, error: "Profil akun belum siap" };

  if (profile.role === "beneficiary") {
    redirect("/rescue");
  } else if (profile.role === "admin") {
    redirect("/admin");
  } else if (profile.role === "processor") {
    redirect("/waste");
  } else {
    redirect("/dashboard");
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
