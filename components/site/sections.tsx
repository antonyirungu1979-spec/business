import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock,
  Gem,
  HandCoins,
  HeartHandshake,
  MapPin,
  Phone,
  Sofa,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CATEGORIES, CATEGORY_IMAGES, REFURBISH_MESSAGE, SITE, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import before1 from "@/assets/before-1.jpg";
import after1 from "@/assets/after-1.jpg";
import before2 from "@/assets/before-2.jpg";
import after2 from "@/assets/after-2.jpg";
import before3 from "@/assets/before-3.jpg";
import after3 from "@/assets/after-3.jpg";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={cn("mt-4 text-4xl md:text-6xl", light ? "text-ink-foreground" : "text-foreground")}>{title}</h2>
      {children && (
        <p className={cn("mt-5 text-base leading-relaxed md:text-lg", light ? "text-ink-muted" : "text-muted-foreground")}>
          {children}
        </p>
      )}
    </div>
  );
}

const BADGES = [
  { icon: Gem, label: "Quality Sofa Designs" },
  { icon: Sofa, label: "Comfortable Seating" },
  { icon: HandCoins, label: "Affordable Prices" },
  { icon: Wrench, label: "Refurbished & Customized" },
];

export function TrustBadges() {
  return (
    <div className="bg-ink">
      <ul className="container-page grid grid-cols-2 gap-px md:grid-cols-4">
        {BADGES.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 py-6 text-ink-foreground md:justify-center md:py-8">
            <Icon className="h-5 w-5 shrink-0 text-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] md:text-sm">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
      {CATEGORIES.map((cat, i) => (
        <Link
          key={cat}
          to="/shop"
          search={{ category: cat }}
          className={cn(
            "group relative block overflow-hidden rounded-lg bg-muted",
            i === 0 ? "col-span-2 aspect-[2/1] md:col-span-1 md:aspect-[3/4]" : "aspect-[3/4]",
          )}
        >
          <img
            src={CATEGORY_IMAGES[cat]}
            alt={cat}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="bg-card-overlay absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
            <span className="font-display text-xl leading-tight text-ink-foreground md:text-2xl">{cat}</span>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-gold transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}

const REASONS = [
  { icon: Gem, title: "Quality sofa designs", text: "Hardwood frames, high-density foam and fabrics chosen to last for years." },
  { icon: Sparkles, title: "Stylish, modern finishes", text: "Clean tailoring and on-trend colours that lift any living room or office." },
  { icon: Sofa, title: "Comfortable seating", text: "Seats built for real life — supportive, plush and made for long evenings." },
  { icon: HandCoins, title: "Affordable prices", text: "Premium looks without the premium markup. Honest pricing in KSh." },
  { icon: Wrench, title: "Refurbished & customized", text: "New fabric, new foam, new life. We rebuild old sofas and make to order." },
  { icon: HeartHandshake, title: "Friendly customer service", text: "Talk to us directly on WhatsApp or call — we answer and we deliver." },
];

export function WhyChooseUs() {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {REASONS.map(({ icon: Icon, title, text }) => (
        <div key={title} className="bg-card p-7 md:p-9">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft">
            <Icon className="h-5 w-5 text-foreground" />
          </div>
          <h3 className="mt-6 text-2xl md:text-3xl">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>
  );
}

export function RefurbishCta() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="relative grid grid-cols-2 gap-3">
          <figure className="relative overflow-hidden rounded-lg">
            <img src={before1} alt="Worn sofa before refurbishment" width={1024} height={768} loading="lazy" className="aspect-[4/5] h-full w-full object-cover" />
            <figcaption className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-ink-foreground">Before</figcaption>
          </figure>
          <figure className="relative mt-10 overflow-hidden rounded-lg">
            <img src={after1} alt="Same sofa after refurbishment" width={1024} height={768} loading="lazy" className="aspect-[4/5] h-full w-full object-cover" />
            <figcaption className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-gold-foreground">After</figcaption>
          </figure>
        </div>
        <div>
          <SectionHeading eyebrow="Refurbishment" title="We Refurbish Your Old Sofa" light>
            Don't throw it away. We replace worn fabric, sagging foam and broken frames — and give your sofa a
            beautiful second life for a fraction of the price of new.
          </SectionHeading>
          <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-ink-muted">
            {["New upholstery & fabric", "Fresh high-density foam", "Frame & spring repair", "Colour & style changes"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 shrink-0 text-gold" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="whatsapp" size="xl">
              <a href={whatsappLink(REFURBISH_MESSAGE)} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> Get a Refurbishment Quote
              </a>
            </Button>
            <Button asChild variant="outline-light" size="xl">
              <Link to="/gallery">See our work</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export const WORK = [
  { before: before1, after: after1, title: "3-Seater Restoration", note: "Torn beige fabric → charcoal velvet, new foam & gold legs" },
  { before: before2, after: after2, title: "Leather Armchair Revival", note: "Cracked leather → smooth cognac leather, brass studs restored" },
  { before: before3, after: after3, title: "Corner Sofa Makeover", note: "Faded grey → warm cream fabric with firm new cushions" },
];

export function BeforeAfterGrid({ limit }: { limit?: number }) {
  const items = limit ? WORK.slice(0, limit) : WORK;
  return (
    <div className="grid gap-10 lg:grid-cols-3 lg:gap-6">
      {items.map((w) => (
        <article key={w.title}>
          <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-lg">
            <figure className="relative">
              <img src={w.before} alt={`${w.title} before`} width={1024} height={768} loading="lazy" className="aspect-square w-full object-cover" />
              <figcaption className="absolute bottom-2 left-2 rounded-full bg-ink/80 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-ink-foreground">Before</figcaption>
            </figure>
            <figure className="relative">
              <img src={w.after} alt={`${w.title} after`} width={1024} height={768} loading="lazy" className="aspect-square w-full object-cover" />
              <figcaption className="absolute bottom-2 left-2 rounded-full bg-gold px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-widest text-gold-foreground">After</figcaption>
            </figure>
          </div>
          <h3 className="mt-5 text-2xl">{w.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{w.note}</p>
        </article>
      ))}
    </div>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{9,15}$/, "Enter a valid phone number"),
  message: z.string().trim().min(1, "Please write a message").max(1000, "Message is too long"),
});

export function ContactForm() {
  const [errors, setErrors] = useState<Partial<Record<"name" | "phone" | "message", string>>>({});

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: form.get("name"),
      phone: form.get("phone"),
      message: form.get("message"),
    });
    if (!parsed.success) {
      const errs: Partial<Record<"name" | "phone" | "message", string>> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as "name" | "phone" | "message"] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    const { name, phone, message } = parsed.data;
    const text = `Hi Naisada, my name is ${name} (${phone}).\n\n${message}`;
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-border bg-card p-6 shadow-soft md:p-8" noValidate>
      <div>
        <h3 className="text-3xl">Send us a message</h3>
        <p className="mt-1 text-sm text-muted-foreground">Your message opens in WhatsApp, ready to send.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" maxLength={100} placeholder="Your name" className="h-11 bg-background" />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" maxLength={15} placeholder="07xx xxx xxx" className="h-11 bg-background" />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" maxLength={1000} rows={5} placeholder="Tell us what you're looking for…" className="bg-background" />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>
      <Button type="submit" variant="whatsapp" size="xl" className="w-full">
        <WhatsAppIcon /> Send via WhatsApp
      </Button>
    </form>
  );
}

export function ContactDetails() {
  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
        <div>
          <p className="eyebrow">Location</p>
          <p className="mt-2 text-lg">{SITE.location}</p>
          <a href={SITE.directionsLink} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold underline decoration-gold underline-offset-4">
            Get directions <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      <div className="flex gap-4">
        <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" />
        <div>
          <p className="eyebrow">Hours</p>
          {SITE.hours.map((h) => (
            <p key={h.days} className="mt-2 text-lg">
              {h.days}: <span className="text-muted-foreground">{h.time}</span>
            </p>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" />
        <div>
          <p className="eyebrow">Phone / WhatsApp</p>
          <a href={SITE.callLink} className="mt-2 block font-display text-3xl font-semibold">
            {SITE.phoneDisplay}
          </a>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="whatsapp">
              <a href={SITE.whatsappBase} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> WhatsApp
              </a>
            </Button>
            <Button asChild variant="ink">
              <a href={SITE.callLink}>
                <Phone /> Call Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MapEmbed({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-muted", className)}>
      <iframe
        title="Naisada Furniture location — Roysambu, Githurai, Thika Road, Nairobi"
        src={SITE.mapEmbed}
        className="h-full min-h-[320px] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
