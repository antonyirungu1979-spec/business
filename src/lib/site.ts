export const SITE = {
  name: "Naisada Furniture",
  tagline: "Quality, Stylish & Affordable Sofas",
  phoneDisplay: "0722 123 801",
  phoneIntl: "254722123801",
  callLink: "tel:+254722123801",
  whatsappBase: "https://wa.me/254722123801",
  location: "Roysambu, Githurai, Thika Road, Nairobi, Kenya",
  locationShort: "Roysambu · Githurai · Thika Road, Nairobi",
  directionsLink:
    "https://www.google.com/maps/search/?api=1&query=Roysambu+Githurai+Thika+Road+Nairobi",
  mapEmbed:
    "https://maps.google.com/maps?q=Roysambu%20Githurai%20Thika%20Road%20Nairobi&z=14&output=embed",
  hours: [
    { days: "Monday – Saturday", time: "8:00 AM – 6:00 PM" },
    { days: "Sunday", time: "By appointment" },
  ],
  socials: [
    { label: "TikTok", handle: "Naisada Furniture", href: "https://www.tiktok.com/search?q=Naisada%20Furniture" },
    { label: "Facebook", handle: "Naisada Furniture", href: "https://www.facebook.com/search/top?q=Naisada%20Furniture" },
    { label: "Instagram", handle: "Naisada Furniture", href: "https://www.instagram.com/explore/search/keyword/?q=Naisada%20Furniture" },
  ],
} as const;

export const CATEGORIES = [
  "L-Shape Sofas",
  "3+2 Sofa Sets",
  "3+2+1+1 Sofa Sets",
  "Butterfly Seats",
  "Back Permanent Sofas",
  "Buffalo Sofas",
  "Recliners",
  "Armchairs / King Chairs",
  "Beds",
  "Other Furniture on Request",
] as const;

export type Category = (typeof CATEGORIES)[number];

const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=75&fit=crop`;

export const CATEGORY_IMAGES: Record<Category, string> = {
  "L-Shape Sofas": u("1550581190-9c1c48d21d6c"),
  "3+2 Sofa Sets": u("1540574163026-643ea20ade25"),
  "3+2+1+1 Sofa Sets": u("1600210492486-724fe5c67fb0"),
  "Butterfly Seats": u("1512212621149-107ffe572d2f"),
  "Back Permanent Sofas": u("1555041469-a586c61ea9bc"),
  "Buffalo Sofas": u("1549187774-b4e9b0445b41"),
  Recliners: u("1550254478-ead40cc54513"),
  "Armchairs / King Chairs": u("1634643836960-c345b3c3e998"),
  Beds: u("1505693416388-ac5ce068fe85"),
  "Other Furniture on Request": u("1501045661006-fcebe0257c3f"),
};

export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=2000&q=80&fit=crop";
export const HERO_OG_IMAGE =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=630&q=80&fit=crop";

/** "65000" -> "65,000" */
export function formatKsh(value: number): string {
  return Math.round(value).toLocaleString("en-KE");
}

export function whatsappLink(message?: string): string {
  if (!message) return SITE.whatsappBase;
  return `${SITE.whatsappBase}?text=${encodeURIComponent(message)}`;
}

export function productOrderMessage(name: string, price: number): string {
  return `Hi Naisada, I want to order ${name} - KSh ${formatKsh(price)}`;
}

export type CartLine = { name: string; price: number; qty: number };

export function cartOrderMessage(lines: CartLine[]): string {
  const items = lines.map((l) => `• ${l.name} x${l.qty} - KSh ${formatKsh(l.price * l.qty)}`);
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  return [`Hi Naisada, I want to order:`, ...items, `Total: KSh ${formatKsh(total)}`].join("\n");
}

export const REFURBISH_MESSAGE =
  "Hi Naisada, I would like a quote to refurbish my sofa. Here are the details:";
