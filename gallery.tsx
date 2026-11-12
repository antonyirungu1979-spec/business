import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/site/icons";
import { BeforeAfterGrid, SectionHeading } from "@/components/site/sections";
import { REFURBISH_MESSAGE, whatsappLink } from "@/lib/site";

const TITLE = "Our Work — Sofa Refurbishment Before & After | Naisada Furniture";
const DESC =
  "See how Naisada Furniture transforms worn sofas and armchairs with new fabric, foam and frames. Get a refurbishment quote on WhatsApp.";

export const Route = createFileRoute("/gallery")({
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
  component: Gallery,
});

function Gallery() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <SectionHeading eyebrow="Our work" title="Before & after refurbishment">
          Old, torn or sagging? We strip it back, rebuild and reupholster — so your favourite sofa feels brand
          new again.
        </SectionHeading>
        <div className="mt-14">
          <BeforeAfterGrid />
        </div>
        <div className="mt-16 flex flex-col items-start gap-6 rounded-lg bg-ink p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-3xl text-ink-foreground md:text-4xl">Have a sofa that needs some love?</h2>
            <p className="mt-2 text-ink-muted">Send us a photo on WhatsApp for a free quote.</p>
          </div>
          <Button asChild variant="whatsapp" size="xl">
            <a href={whatsappLink(REFURBISH_MESSAGE)} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Get a Quote
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
