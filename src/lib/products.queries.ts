import { queryOptions } from "@tanstack/react-query";
import { getProduct, listProducts } from "./products.functions";

export const productsQuery = () =>
  queryOptions({
    queryKey: ["products"],
    queryFn: () => listProducts(),
    staleTime: 30_000,
  });

export const productQuery = (id: string) =>
  queryOptions({
    queryKey: ["products", id],
    queryFn: () => getProduct({ data: { id } }),
    staleTime: 30_000,
  });
