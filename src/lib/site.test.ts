import { describe, expect, it } from "vitest";
import { cartOrderMessage, formatKsh, productOrderMessage, whatsappLink } from "./site";

describe("WhatsApp ordering", () => {
  it("builds the product order message in the agreed format", () => {
    expect(productOrderMessage("Onyx L-Shape Sectional", 95000)).toBe(
      "Hi Naisada, I want to order Onyx L-Shape Sectional - KSh 95,000",
    );
  });

  it("sends orders to the 0722123801 WhatsApp number", () => {
    expect(whatsappLink("Hi")).toBe("https://wa.me/254722123801?text=Hi");
  });

  it("totals the cart in KSh", () => {
    const msg = cartOrderMessage([
      { name: "A", price: 20000, qty: 2 },
      { name: "B", price: 5000, qty: 1 },
    ]);
    expect(msg).toContain("Total: KSh 45,000");
  });

  it("formats KSh with thousands separators", () => {
    expect(formatKsh(1250000)).toBe("1,250,000");
  });
});
