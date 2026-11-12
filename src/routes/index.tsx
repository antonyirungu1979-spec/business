import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/icons";
import { ProductCard } from "@/components/site/ProductCard";
import {
  BeforeAfterGrid,
  CategoryGrid,
  ContactDetails,
  MapEmbed,
  RefurbishCta,
  SectionHeading,
  TrustBadges,
  WhyChooseUs,
} from "@/components/site/sections";
import { productsQuery } from "@/lib/products.queries";
import { HERO_IMAGE, HERO_OG_IMAGE, SITE } from "@/lib/site";

const TITLE = "Naisada Furniture — Quality, Stylish & Affordable Sofas in Nairobi";
const DESC =
  "We sell & refurbish sofas — L-shapes, 3+2 sets, recliners, king chairs and beds. Visit us in Roysambu, Githurai, Thika Road, Nairobi.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:image", content: HERO_OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO_OG_IMAGE },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const featured = products.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink">
        <img
          src={HERO_IMAGE}
          alt="Elegant cream sofa in a bright modern Nairobi living room"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="bg-hero-overlay absolute inset-0 -z-10" />
        <div className="container-page flex min-h-[calc(100svh-4rem)] flex-col justify-end pb-14 pt-32 md:min-h-[44rem] md:justify-center md:py-28">
          <div className="max-w-2xl animate-rise">
            <p className="eyebrow">Naisada Furniture · Nairobi</p>
            <h1 className="mt-5 text-5xl text-ink-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Quality, Stylish <span className="italic text-gold">&amp;</span> Affordable Sofas
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink-muted md:text-xl">
              We Sell &amp; Refurbish Sofas — Modern Designs for Homes &amp; Offices
            </p>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Button asChild variant="whatsapp" size="xl">
                <a href={SITE.whatsappBase} target="_blank" rel="noreferrer">
                  <WhatsAppIcon /> WhatsApp Us
                </a>
              </Button>
              <Button asChild variant="gold" size="xl">
                <a href={SITE.callLink}>
                  <Phone /> Call Now
                </a>
              </Button>
              <Button asChild variant="outline-light" size="xl">
                <Link to="/shop">View Our Furniture</Link>
              </Button>
              <Button asChild variant="outline-light" size="xl">
                <a href={SITE.directionsLink} target="_blank" rel="noreferrer">
                  <MapPin /> Get Directions
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <TrustBadges />

      {/* What we sell */}
      <section className="section-pad">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="What we sell" title="Seating for every space">
              From compact apartments to executive offices — find the perfect sofa, chair or bed.
            </SectionHeading>
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-gold underline-offset-8">
              Shop all furniture <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12">
            <CategoryGrid />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section-pad border-t border-border bg-muted/50">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="New in store" title="Featured pieces" />
            <Button asChild variant="outline-ink" size="xl">
              <Link to="/shop">
                View full shop <ArrowRight />
              </Link>
            </Button>
          </div>
          {featured.length === 0 ? (
            <p className="mt-12 text-muted-foreground">New pieces are on their way. Check back soon.</p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why choose us */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Why choose us" title="Built to be lived on" align="center">
            Thoughtful design, honest prices and service you can reach on WhatsApp.
          </SectionHeading>
          <div className="mt-14">
            <WhyChooseUs />
          </div>
        </div>
      </section>

      <RefurbishCta />

      {/* Our work */}
      <section className="section-pad">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading eyebrow="Our work" title="Before & after">
              Real transformations from our Thika Road workshop.
            </SectionHeading>
            <Link to="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-gold underline-offset-8">
              View gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12">
            <BeforeAfterGrid />
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="section-pad border-t border-border bg-muted/50">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Visit our showroom" title="Come sit before you buy" />
            <div className="mt-10">
              <ContactDetails />
            </div>
          </div>
          <MapEmbed className="h-[360px] lg:h-auto" />
        </div>
      </section>
    </>
  );
}
