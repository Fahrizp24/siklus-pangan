"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col items-center justify-center text-center px-4">
      {/* Background Soft Ambient Light Gradients */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full flex flex-col items-center space-y-6"
      >
        {/* Brand Badge */}
        <Badge
          variant="outline"
          className="px-3.5 py-1.5 gap-2 border-primary/20 bg-primary/5 text-primary text-xs font-semibold rounded-full shadow-xs"
        >
          <Leaf className="w-3.5 h-3.5 text-primary" />
          <span>SiklusPangan — Vibe Code TCC 2026 UTM</span>
          <Sparkles className="w-3 h-3 text-secondary" />
        </Badge>

        {/* Title */}
        <h1 className="font-headline text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Penyelamatan Pangan &amp; <br />
          <span className="text-gradient">
            Biokonversi Limbah Organik
          </span>
        </h1>

        {/* Description */}
        <p className="font-body text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Mengintegrasikan rantai pasok sirkular dari hulu ke hilir: Penyelamatan makanan berlebih (<em>Surplus Food Rescue</em>) dan biokonversi sisa makanan basi berbasis insentif logistik terbalik (<em>Reverse Tipping Fee</em>).
        </p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="pt-2 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Button asChild size="lg" className="rounded-xl shadow-md gap-2 font-label">
            <Link href="/rescue">
              <span>Jelajahi Radar Surplus</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-xl border-border hover:bg-muted font-label"
          >
            <Link href="/leaderboard">
              <span>Wall of Fame Donatur</span>
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
