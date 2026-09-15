"use client";

import { ShieldCheck, Recycle, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: ShieldCheck,
    title: "Surplus Food Rescue",
    desc: "Pemindai VLM Gemini & Live Radar Surplus Food aman konsumsi untuk penerima manfaat.",
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Recycle,
    title: "Biokonversi Limbah",
    desc: "Pengolahan sisa makanan basi ke maggot BSF & peternak dengan verifikasi QR Code.",
    iconColor: "text-tertiary",
    bgColor: "bg-tertiary/10",
  },
  {
    icon: Award,
    title: "Analitik Dampak ESG",
    desc: "Kalkulator reduksi emisi metana (CH₄) & penerbitan sertifikat dampak ESG digital.",
    iconColor: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="max-w-5xl w-full mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full border-border/80 bg-card hover:shadow-lg transition-all cursor-pointer group">
                <CardHeader className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}
                  >
                    <Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm mt-1.5 leading-relaxed font-body">
                    {item.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
