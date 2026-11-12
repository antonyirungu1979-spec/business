import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, BadgeCheck, Phone, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/icons";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import { productQuery, productsQuery } from "@/lib/products.queries";
import { formatKsh, productOrderMessage, SITE, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/products/$productId")({
  loader: async ({ context, params }) => {
    if (!/^[0-9a-f-]{36}$/i.test(params.productId)) throw notFound();
    const product = await context.queryClient.ensureQueryData(productQuery(params.productId));
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(productsQuery());
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) {
      return { meta: [{ title: "Product unavailable — Naisada Furniture" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${p.name} — KSh ${formatKsh(p.price)} | Naisada Furniture`;
    const desc = p.description.slice(0, 155) || `${p.name} from Naisada Furniture, Nairobi.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(p.image_url?.startsWith("https://")
          ? [
              { property: "og:image", content: p.image_url },
              { name: "twitter:image", content: p.image_url },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-4 text-5xl">This piece isn't available</h1>
      <p className="mt-4 text-muted-foreground">It may have sold out. Browse the rest of our collection.</p>
      <Button asChild variant="ink" size="xl" className="mt-8">
        <Link to="/shop">Back to shop</Link>
      </Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(productId));
  const { data: all } = useSuspenseQuery(productsQuery());
  const { add } = useCart();

  if (!product) return null;
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <>
      <div className="container-page pt-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
      </div>
      <section className="container-page grid gap-10 py-8 md:py-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-lg bg-muted">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center font-display text-4xl text-muted-foreground">
                Naisada
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-5 lg:pt-4">
          <Link
            to="/shop"
            search={{ category: product.category }}
            className="eyebrow hover:underline"
          >
            {product.category}
          </Link>
          <h1 className="mt-4 text-5xl md:text-6xl">{product.name}</h1>
          <p className="mt-6 font-display text-4xl font-semibold">
            <span className="mr-2 align-middle font-sans text-sm font-bold tracking-widest text-muted-foreground">KSH</span>
            {formatKsh(product.price)}
          </p>
          {product.description && (
            <p className="mt-6 whitespace-pre-line leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          <div className="mt-8 grid gap-3">
            <Button asChild variant="whatsapp" size="xl" className="h-14 text-base">
              <a href={whatsappLink(productOrderMessage(product.name, product.price))} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> Order on WhatsApp
              </a>
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="ink" size="xl">
                <a href={SITE.callLink}>
                  <Phone /> Call Now
                </a>
              </Button>
              <Button
                variant="outline-ink"
                size="xl"
                onClick={() =>
                  add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url })
                }
              >
                <ShoppingBag /> Add to Cart
              </Button>
            </div>
          </div>

          <ul className="mt-10 space-y-3 border-t border-border pt-8 text-sm">
            <li className="flex items-center gap-3">
              <BadgeCheck className="h-4 w-4 text-gold" /> Custom sizes & fabrics on request
            </li>
            <li className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-gold" /> Delivery within Nairobi — ask for rates
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gold" /> {SITE.phoneDisplay} · {SITE.hours[0].days} {SITE.hours[0].time}
            </li>
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad border-t border-border bg-muted/50">
          <div className="container-page">
            <p className="eyebrow">You may also like</p>
            <h2 className="mt-4 text-4xl md:text-5xl">More {product.category}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
