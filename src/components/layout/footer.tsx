import Link from "next/link";
import Image from "next/image";
import { FOOTER_SECTIONS, FOOTER_INFO } from "@/lib/nav";
import logoText from "@/assets/logo-text.webp";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-white text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Brand & Engineering Centers */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <Link href="/" className="inline-block group py-0.5">
              <Image
                src={logoText}
                alt="SiklusPangan"
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <p className="font-body text-sm text-neutral/80 leading-relaxed max-w-md">
              {FOOTER_INFO.description}
            </p>

            <div className="pt-2 font-body text-xs text-muted-foreground">
              <span>Engineering Centers: </span>
              {FOOTER_INFO.engineeringCenters.map((hub, idx) => (
                <span key={hub.city}>
                  <strong className="text-neutral font-semibold">
                    {hub.city}
                  </strong>{" "}
                  ({hub.detail})
                  {idx < FOOTER_INFO.engineeringCenters.length - 1 ? " • " : "."}
                </span>
              ))}
            </div>
          </div>

          {/* Right Columns: Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="flex flex-col">
                <h4 className="font-headline text-xs font-bold tracking-wider text-secondary uppercase mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-body text-xs text-neutral/70 hover:text-primary transition-colors block leading-snug"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & System Status */}
        <div className="mt-12 pt-6 border-t border-border/70 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-body text-muted-foreground">
          <p className="text-center sm:text-left">{FOOTER_INFO.copyright}</p>

          <div className="flex items-center gap-5 shrink-0">
            {/* System Status Indicator */}
            <div className="flex items-center gap-2 text-primary font-medium font-label">
              <span className="h-2 w-2 rounded-full bg-primary inline-block" />
              <span>{FOOTER_INFO.systemStatus}</span>
            </div>

            {/* Engine Version */}
            <span className="font-label text-muted-foreground/80">
              Versi Engine: {FOOTER_INFO.engineVersion}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
