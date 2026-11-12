import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createPublicClient } from "./products.server";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string | null;
  created_at: string;
};

function client() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Backend is not configured");
  return createPublicClient(url, key);
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await client()
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((p) => ({ ...p, price: Number(p.price) })) as Product[];
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { data: row, error } = await client()
      .from("products")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? ({ ...row, price: Number(row.price) } as Product) : null;
  });
