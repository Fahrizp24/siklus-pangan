import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getUserProfile } from "@/actions/profile";
import { ProfileHeader } from "@/components/pages/profile/profile-header";
import { ProfileForm } from "@/components/pages/profile/profile-form";
import { ProfileFinancials } from "@/components/pages/profile/profile-financials";
import { ProfileSecurity } from "@/components/pages/profile/profile-security";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const profile = await getUserProfile();

  return (
    <AppShell>
      <main className="w-full py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <ProfileHeader profile={profile} />
        <ProfileFinancials profile={profile} />
        <ProfileForm profile={profile} />
        <ProfileSecurity />
      </main>
    </AppShell>
  );
}
