import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { RefurbishCta, SectionHeading, TrustBadges, WhyChooseUs } from "@/components/site/sections";

const TITLE = "Why Choose Naisada Furniture — Quality Sofas, Fair Prices";
const DESC =
  "Quality sofa designs, modern finishes, comfortable seating, affordable prices and expert sofa refurbishment in Nairobi.";

export const Route = createFileRoute("/why-us")({
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
  component: WhyUs,
});

function WhyUs() {
  return (
    <>
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Why choose us" title={<>Furniture you'll be proud to come home to</>}>
            At Naisada Furniture we specialize in quality, stylish and affordable furniture. We sell and refurbish
            sofas, and offer a wide variety of modern designs for homes, offices and other spaces.
          </SectionHeading>
          <div className="mt-14">
            <WhyChooseUs />
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild variant="ink" size="xl">
              <Link to="/shop">Browse the collection</Link>
            </Button>
            <Button asChild variant="outline-ink" size="xl">
              <Link to="/contact">Visit our showroom</Link>
            </Button>
          </div>
        </div>
      </section>
      <TrustBadges />
      <RefurbishCta />
    </>
  );
}
