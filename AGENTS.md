<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Public product reads go through `createServerFn` in `src/lib/products.functions.ts` with a per-request publishable client; why: loaders run during SSR, where the browser client and session are unavailable.
- Admin writes (products, storage) use the browser client and rely on RLS + `has_role(auth.uid(), 'admin')`; why: database policies are the single enforcement point, so no privileged server code is needed.
- Admin roles live only in `public.user_roles`; why: roles on user-editable data allow privilege escalation.
- Product images are stored in a private `product-images` bucket and saved as long-lived signed URLs in `products.image_url`; why: the workspace blocks public buckets.
- Business details (phone, links, hours, categories) and WhatsApp message builders live in `src/lib/site.ts`; why: one source keeps every button and message consistent.
