import { createFileRoute } from "@tanstack/react-router";
import { ContactDetails, ContactForm, MapEmbed, SectionHeading } from "@/components/site/sections";

const TITLE = "Contact Naisada Furniture — Roysambu, Githurai, Thika Road";
const DESC =
  "Visit our showroom in Roysambu, Githurai, Thika Road, Nairobi. Open Mon–Sat 8 AM–6 PM. Call or WhatsApp 0722 123 801.";

export const Route = createFileRoute("/contact")({
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
  component: Contact,
});

function Contact() {
  return (
    <>
      <section className="section-pad">
        <div className="container-page grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Contact" title="Let's find your perfect sofa">
              Call, WhatsApp or drop by the showroom — we're happy to help.
            </SectionHeading>
            <div className="mt-12">
              <ContactDetails />
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
      <section className="container-page pb-20">
        <MapEmbed className="h-[420px]" />
      </section>
    </>
  );
}
