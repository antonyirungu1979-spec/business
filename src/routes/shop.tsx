import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/site/ProductCard";
import { productsQuery } from "@/lib/products.queries";
import { CATEGORIES } from "@/lib/site";
import { cn } from "@/lib/utils";

type Sort = "newest" | "price-asc" | "price-desc";
type ShopSearch = { q?: string | undefined; category?: string | undefined; sort?: Sort | undefined };

const TITLE = "Shop Sofas & Furniture — Naisada Furniture Nairobi";
const DESC =
  "Browse L-shape sofas, 3+2 sets, butterfly seats, buffalo sofas, recliners, king chairs and beds. Prices in KSh. Order on WhatsApp.";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => {
    const sort = search["sort"];
    const q = search["q"];
    const category = search["category"];
    return {
      q: typeof q === "string" && q ? q.slice(0, 100) : undefined,
      category:
        typeof category === "string" && (CATEGORIES as readonly string[]).includes(category) ? category : undefined,
      sort: sort === "price-asc" || sort === "price-desc" || sort === "newest" ? sort : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Shop,
});

function Shop() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const q = search.q ?? "";
  const sort: Sort = search.sort ?? "newest";

  const update = (patch: Partial<ShopSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (search.category && p.category !== search.category) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, q, search.category, sort]);

  return (
    <>
      <section className="border-b border-border bg-muted/50">
        <div className="container-page py-14 md:py-20">
          <p className="eyebrow">The collection</p>
          <h1 className="mt-4 text-5xl md:text-7xl">Shop furniture</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Every piece can be ordered straight on WhatsApp. Need a different size or fabric? Just ask.
          </p>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => update({ q: e.target.value || undefined })}
              placeholder="Search sofas, beds, chairs…"
              className="h-12 bg-card pl-10"
              aria-label="Search products"
              maxLength={100}
            />
          </div>
          <Select value={sort} onValueChange={(v) => update({ sort: v === "newest" ? undefined : (v as Sort) })}>
            <SelectTrigger className="h-12 bg-card md:w-56" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0">
          {[undefined, ...CATEGORIES].map((c) => {
            const active = search.category === c;
            return (
              <button
                key={c ?? "all"}
                onClick={() => update({ category: c })}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-colors",
                  active
                    ? "border-ink bg-ink text-ink-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-ink hover:text-foreground",
                )}
              >
                {c ?? "All"}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {results.length} {results.length === 1 ? "piece" : "pieces"}
            {search.category ? ` in ${search.category}` : ""}
          </span>
          {(search.category || q) && (
            <button
              onClick={() => update({ category: undefined, q: undefined })}
              className="inline-flex items-center gap-1 font-semibold text-foreground"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="mt-10 rounded-lg border border-dashed border-border p-12 text-center">
            <p className="font-display text-3xl">Nothing matches yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another search — or message us on WhatsApp and we'll make it for you.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
