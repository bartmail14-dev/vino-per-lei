# Vino per Lei — Claude Code Instructies

## EERSTE ACTIE VOLGENDE SESSIE
**LEES `VOLGENDE-SESSIE.md` EERST** — bevat complete overdracht + copy-paste instructie.

Prioriteit: FULL AUDIT — alle flows testen (auth, producten, responsive, checkout), visuele issues fixen, Shopify API versie updaten, Carla's feedback verwerken.

## Project
- **Locatie**: `C:\Users\BartVisser\Desktop\vino-per-lei`
- **Tech**: Next.js 16.1 + React 19 + TypeScript + Tailwind v4 + Shopify Storefront API
- **Shopify Admin**: `https://vino-per-lei-2.myshopify.com/admin`
- **Klant**: Carla Daniels

## Kritieke regels
- **NOOIT `next dev` draaien** — crasht Claude Code sessie
- **Build + serve**: `npm run build && npx next start --port 3099`
- **Port cleanup**: `npx --yes kill-port 3099`
- **NOOIT AI/agents/tooling vermelden** in klant-zichtbare content
- Communicatie in het Nederlands, code/comments in het Engels
