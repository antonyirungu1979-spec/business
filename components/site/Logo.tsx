import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link to="/" className={cn("group inline-flex flex-col leading-none", className)} aria-label="Naisada Furniture home">
      <span
        className={cn(
          "font-display text-2xl font-semibold tracking-[0.18em] md:text-[1.7rem]",
          light ? "text-ink-foreground" : "text-foreground",
        )}
      >
        NAISADA
      </span>
      <span className="mt-1 text-[0.6rem] font-bold tracking-[0.5em] text-gold">FURNITURE</span>
    </Link>
  );
}
