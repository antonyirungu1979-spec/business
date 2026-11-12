import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { cartOrderMessage, formatKsh, whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total, clear } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle className="font-display text-3xl">Your Cart</SheetTitle>
          <SheetDescription>Send your order to us on WhatsApp and we'll confirm delivery.</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <ShoppingBag className="h-10 w-10 text-gold" />
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild variant="ink" onClick={() => setOpen(false)}>
              <Link to="/shop">Browse furniture</Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">KSh {formatKsh(item.price)}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                          onClick={() => setQty(item.id, item.qty - 1)}
                          aria-label={`Decrease ${item.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          aria-label={`Increase ${item.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => remove(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-4 border-t border-border bg-card p-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">Total</span>
                <span className="font-display text-3xl font-semibold">KSh {formatKsh(total)}</span>
              </div>
              <Button asChild variant="whatsapp" size="xl" className="w-full">
                <a
                  href={whatsappLink(cartOrderMessage(items))}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon /> Order on WhatsApp
                </a>
              </Button>
              <button onClick={clear} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                Clear cart
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
