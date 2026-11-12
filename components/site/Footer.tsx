import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";
import { SOCIAL_ICONS, WhatsAppIcon } from "./icons";

export function Footer() {
  return (
    <footer className="bg-ink text-ink-muted">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">
            Quality, stylish and affordable furniture. We sell and refurbish sofas for homes, offices and every
            space in between.
          </p>
          <div className="mt-6 flex gap-3">
            {SITE.socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.label];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${s.label}: ${s.handle}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-foreground/20 text-ink-foreground transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="eyebrow">Explore</h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/shop" className="hover:text-ink-foreground">Shop</Link></li>
            <li><Link to="/why-us" className="hover:text-ink-foreground">Why Choose Us</Link></li>
            <li><Link to="/gallery" className="hover:text-ink-foreground">Our Work</Link></li>
            <li><Link to="/contact" className="hover:text-ink-foreground">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="eyebrow">Visit</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={SITE.directionsLink} target="_blank" rel="noreferrer" className="hover:text-ink-foreground">
                {SITE.location}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                {SITE.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="eyebrow">Talk to us</h3>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={SITE.callLink} className="flex items-center gap-3 hover:text-ink-foreground">
                <Phone className="h-4 w-4 text-gold" /> {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={SITE.whatsappBase} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-ink-foreground">
                <WhatsAppIcon className="h-4 w-4 text-gold" /> WhatsApp us
              </a>
            </li>
            {SITE.socials.map((s) => (
              <li key={s.label} className="text-xs">
                {s.label}: <span className="text-ink-foreground">{s.handle}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Naisada Furniture. All rights reserved.</span>
          <span>Roysambu · Githurai · Thika Road, Nairobi</span>
        </div>
      </div>
    </footer>
  );
}
