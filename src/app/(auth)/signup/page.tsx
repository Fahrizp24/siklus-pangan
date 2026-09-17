import type { Metadata } from "next";
import SignupForm from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Daftar Akun",
  description: "Daftar akun untuk bergabung dalam ekosistem penyelamatan surplus pangan dan pengolahan residu sirkular.",
};

export default function SignupPage() {
  return <SignupForm />;
}
