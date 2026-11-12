import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products.functions";
import { formatKsh, productOrderMessage, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-soft transition-shadow hover:shadow-lift">
      <Link
        to="/products/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-2xl text-muted-foreground">
            Naisada
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-foreground backdrop-blur">
          {product.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to="/products/$productId" params={{ productId: product.id }}>
          <h3 className="text-2xl transition-colors group-hover:text-gold">{product.name}</h3>
        </Link>
        <p className="mt-1 text-lg font-semibold">
          <span className="text-xs font-bold tracking-widest text-muted-foreground">KSH </span>
          {formatKsh(product.price)}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button asChild variant="whatsapp" className="col-span-2 h-11">
            <a href={whatsappLink(productOrderMessage(product.name, product.price))} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Order on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline-ink" className="h-10">
            <Link to="/products/$productId" params={{ productId: product.id }}>
              View Details
            </Link>
          </Button>
          <Button
            variant="ink"
            className="h-10"
            onClick={() => add({ id: product.id, name: product.name, price: product.price, image_url: product.image_url })}
          >
            <ShoppingBag /> Add
          </Button>
        </div>
      </div>
    </article>
  );
}
