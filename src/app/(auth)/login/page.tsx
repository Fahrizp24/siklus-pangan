import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Anda untuk menggunakan platform penyelamatan surplus pangan SiklusPangan.",
};

export default function LoginPage() {
  return <LoginForm />;
}
