import { Link } from "@tanstack/react-router";
import { Menu, Phone, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/why-us", label: "Why Us" },
  { to: "/gallery", label: "Our Work" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="hidden bg-ink text-ink-muted md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs tracking-wide">
          <span>{SITE.locationShort}</span>
          <span>Mon – Sat · 8:00 AM – 6:00 PM · Sunday by appointment</span>
        </div>
      </div>
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:-bottom-1.5 data-[status=active]:after:left-0 data-[status=active]:after:h-px data-[status=active]:after:w-full data-[status=active]:after:bg-gold"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline-ink" size="sm" className="hidden h-10 px-4 md:inline-flex">
            <a href={SITE.callLink}>
              <Phone /> {SITE.phoneDisplay}
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10"
            onClick={() => setOpen(true)}
            aria-label={`Open cart (${count} items)`}
          >
            <ShoppingBag className="!size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-bold text-gold-foreground">
                {count}
              </span>
            )}
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 lg:hidden" aria-label="Open menu">
                <Menu className="!size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm bg-background">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo />
              </SheetHeader>
              <nav className="mt-6 flex flex-col px-4" aria-label="Mobile">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    activeOptions={{ exact: n.to === "/" }}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-border py-4 font-display text-2xl text-foreground data-[status=active]:text-gold"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-3 px-4">
                <Button asChild variant="ink" size="xl">
                  <a href={SITE.callLink}>
                    <Phone /> Call {SITE.phoneDisplay}
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
