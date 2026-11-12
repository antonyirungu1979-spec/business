import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { ExternalLink, ImagePlus, Layers, Loader2, LogOut, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Logo } from "@/components/site/Logo";
import { productsQuery } from "@/lib/products.queries";
import type { Product } from "@/lib/products.functions";
import { CATEGORIES, formatKsh } from "@/lib/site";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Naisada Furniture" },
      { name: "description", content: "Naisada Furniture product management." },
      { property: "og:title", content: "Admin — Naisada Furniture" },
      { property: "og:description", content: "Naisada Furniture product management." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const BUCKET = "product-images";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

function storagePathFromUrl(url: string | null): string | null {
  if (!url) return null;
  const marker = `/object/sign/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length).split("?")[0] ?? "");
}

function AdminPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setUser(session?.user ?? null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }
  if (!user) return <LoginForm />;
  return <AdminGate user={user} />;
}

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = z
      .object({ email: z.string().trim().email().max(255), password: z.string().min(6).max(128) })
      .safeParse({ email: form.get("email"), password: form.get("password") });
    if (!parsed.success) {
      setError("Enter a valid email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) setError("Incorrect email or password.");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-ink lg:block">
        <img
          src="https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=1400&q=80&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute bottom-12 left-12">
          <Logo light />
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-3 text-5xl">Sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage products shown on the website.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="username" className="h-11 bg-card" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" className="h-11 bg-card" required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="ink" size="xl" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />} Sign in
          </Button>
          <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">
            ← Back to website
          </Link>
        </form>
      </div>
    </div>
  );
}

function AdminGate({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const roleQuery = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.removeQueries({ queryKey: ["is-admin"] });
    await supabase.auth.signOut();
  }

  if (roleQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!roleQuery.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-4xl">No admin access</h1>
        <p className="text-muted-foreground">This account can't manage products.</p>
        <Button variant="ink" onClick={signOut}>
          <LogOut /> Sign out
        </Button>
      </div>
    );
  }

  return <Dashboard email={user.email ?? ""} onSignOut={signOut} />;
}

function Dashboard({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery(productsQuery());
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const categoriesInUse = new Set(products.map((p) => p.category)).size;

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    const { error } = await supabase.from("products").delete().eq("id", deleting.id);
    if (error) {
      toast.error("Could not delete product", { description: error.message });
    } else {
      const path = storagePathFromUrl(deleting.image_url);
      if (path) await supabase.storage.from(BUCKET).remove([path]);
      toast.success(`Deleted “${deleting.name}”`);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
    }
    setDeleteBusy(false);
    setDeleting(null);
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-background">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full bg-gold-soft px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground md:inline">{email}</span>
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ExternalLink /> <span className="hidden sm:inline">View site</span>
              </Link>
            </Button>
            <Button variant="outline-ink" size="sm" onClick={onSignOut}>
              <LogOut /> <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page py-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="mt-2 text-5xl">Products</h1>
          </div>
          <Button variant="gold" size="xl" onClick={() => setCreating(true)}>
            <Plus /> Add Product
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <StatCard icon={Package} label="Total Products" value={isLoading ? "–" : String(products.length)} />
          <StatCard
            icon={Layers}
            label="Categories"
            value={String(CATEGORIES.length)}
            hint={isLoading ? undefined : `${categoriesInUse} with products`}
          />
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="text-right">Price (KSh)</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No products yet. Click “Add Product” to create one.
                  </TableCell>
                </TableRow>
              )}
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="h-12 w-16 overflow-hidden rounded bg-muted">
                      {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" loading="lazy" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground md:hidden">{p.category}</p>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{p.category}</TableCell>
                  <TableCell className="text-right font-semibold">{formatKsh(p.price)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleting(p)}
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <ProductDialog
        open={creating || !!editing}
        product={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.name}” will be removed from the website. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              disabled={deleteBusy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteBusy && <Loader2 className="animate-spin" />} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  hint?: string | undefined;
}) {
  return (
    <div className="flex items-center gap-5 rounded-lg border border-border bg-card p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="font-display text-4xl font-semibold leading-none">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150, "Name is too long"),
  category: z.enum(CATEGORIES, { message: "Choose a category" }),
  price: z.coerce.number({ message: "Enter a price" }).min(0, "Price can't be negative").max(100_000_000),
  description: z.string().trim().max(3000, "Description is too long"),
});

function ProductDialog({ open, product, onClose }: { open: boolean; product: Product | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<"name" | "category" | "price" | "description", string>>>({});

  useEffect(() => {
    if (!open) return;
    setName(product?.name ?? "");
    setCategory(product?.category ?? "");
    setPrice(product ? String(product.price) : "");
    setDescription(product?.description ?? "");
    setFile(null);
    setPreview(product?.image_url ?? null);
    setErrors({});
  }, [open, product]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onFile(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }
    setFile(f);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = productSchema.safeParse({ name, category, price: price === "" ? undefined : price, description });
    if (!parsed.success) {
      const errs: Partial<Record<"name" | "category" | "price" | "description", string>> = {};
      for (const issue of parsed.error.issues)
        errs[issue.path[0] as "name" | "category" | "price" | "description"] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      let image_url = product?.image_url ?? null;
      if (file) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
        const path = `products/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        const { data: signed, error: signErr } = await supabase.storage.from(BUCKET).createSignedUrl(path, TEN_YEARS);
        if (signErr || !signed) throw signErr ?? new Error("Could not create image link");
        const oldPath = storagePathFromUrl(product?.image_url ?? null);
        image_url = signed.signedUrl;
        if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);
      }

      const payload = { ...parsed.data, image_url };
      const { error } = product
        ? await supabase.from("products").update(payload).eq("id", product.id)
        : await supabase.from("products").insert(payload);
      if (error) throw error;

      toast.success(product ? "Product updated" : "Product added");
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    } catch (err) {
      toast.error("Could not save product", { description: err instanceof Error ? err.message : undefined });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto bg-background sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">{product ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>Changes appear on the website straight away.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label>Image</Label>
            <label className="group relative flex aspect-[16/9] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted">
              {preview ? (
                <>
                  <img src={preview} alt="Product preview" className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-2 text-center text-xs font-semibold text-ink-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    Change image
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                  <ImagePlus className="h-6 w-6" /> Click to upload an image
                </span>
              )}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-name">Name</Label>
            <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={150} className="h-11 bg-card" />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 bg-card" aria-label="Category">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-price">Price (KSh)</Label>
              <Input
                id="p-price"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 bg-card"
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea
              id="p-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={3000}
              className="bg-card"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" variant="ink" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />} {product ? "Save changes" : "Add product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
