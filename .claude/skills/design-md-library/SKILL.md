---
name: design-md-library
description: Library of 74 ready-to-use DESIGN.md design systems extracted from real websites (Apple, Stripe, Linear, Vercel, Figma, Tesla, Nike, Notion, Supabase, Spotify and more). Use when the user asks to build or restyle a UI "like <brand>", wants a concrete design language, color tokens, type scale or motion rules to work from, asks for a DESIGN.md for the project, or needs a reference design system before writing frontend code.
metadata:
  source: https://github.com/VoltAgent/awesome-design-md
  license: MIT (c) VoltAgent
  version: "1.0.0"
---

# DESIGN.md Library

74 design systems extracted from real production websites, each as a single
`DESIGN.md`: color tokens, typography, spacing, radii, shadows, component
patterns and motion rules. Reference material — read one, then build.

## When to use

- The user names a brand as a visual target ("like Linear", "Apple-ish", "make it feel like Stripe").
- A build needs a concrete, coherent design language instead of invented defaults.
- The user wants a `DESIGN.md` for their own project and needs a model to adapt.
- You need real token values (hex, type scale, radii) rather than approximations.

Do not use it to clone a brand's identity wholesale for production — these are
*inspired-by* analyses. Take the system (scale, rhythm, structure), not the
trademarks: no brand logos, wordmarks or proprietary fonts.

## How to use

1. Pick a brand from the catalog below that matches the requested vibe. If the
   user named one that is not listed, pick the closest match and say so.
2. Read only that file: `references/<brand>/DESIGN.md`. Never read the whole
   library — each file is 400-900 lines.
3. Extract the tokens into the project's own convention (CSS custom properties,
   Tailwind config, design tokens file), renamed for this project.
4. Build against those tokens. Do not mix systems: one brand per surface unless
   the user explicitly asks for a blend.

When the user wants a `DESIGN.md` of their own, use the structure of a catalog
entry as the template and fill it with the project's real values.

## Pairs well with

- `design-taste-frontend` — for the taste/judgement layer on landings and portfolios.
- `web-design-guidelines` — to audit the result for accessibility and UX compliance.
- `image-to-code` — when the direction should start from generated imagery instead.

## Catalog

74 systems. Path: `references/<key>/DESIGN.md`

| Key | Design language |
| --- | --- |
| `airbnb` | A warm, generous consumer marketplace anchored on a clean white canvas and Airbnb Rausch (#ff385c), the single brand voltage that carries every… |
| `airtable` | A sober, editorial workflow-software interface anchored on white canvas and dark-ink type, where brand voltage comes from full-bleed signature cards… |
| `apple` | A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, framed by SF… |
| `binance` | A confident financial-platform interface anchored on a deep near-black canvas, where Binance's iconic yellow (#FCD535) carries every primary CTA… |
| `bmw` | BMW's corporate site — distinct from BMW M's motorsport-bombastic variant, this is a measured and settled corporate-automotive interface. On a light… |
| `bmw-m` | A motorsport-engineering interface anchored on a near-black canvas with white BMW Type Next Latin display headlines in confident UPPERCASE. The brand… |
| `bugatti` | An austere luxury-automotive interface that uses near-pure black canvas, white uppercase letterspaced display, and full-bleed automotive photography… |
| `cal` | A clean, calendar-software-first interface anchored on white canvas with black primary CTAs and custom Cal Sans display typography. The system reads… |
| `claude` | A warm-canvas editorial interface for Anthropic's Claude product. The system anchors on a tinted cream canvas with serif display headlines, warm… |
| `clay` | A vibrant claymation-meets-data interface for Clay.com (GTM data-orchestration platform). Anchors on white canvas with dark-navy primary CTAs, custom… |
| `clickhouse` | A high-performance database interface anchored on near-pure black canvas with electric yellow as the brand voltage. White typography in confident… |
| `cohere` | Cohere's 2026 web system is a controlled enterprise AI interface built from stark white editorial space, deep green-black product bands, soft mineral… |
| `coinbase` | An institutional-grade crypto exchange whose marketing surfaces read like a quietly-confident financial-services brand. The base canvas is pure… |
| `composio` | A developer-tools brand for AI-agent tool integration whose marketing surfaces lean into a dark, technical aesthetic with a single deep-electric-blue… |
| `cursor` | An AI-first code editor whose marketing site reads like a quietly-confident developer-tools brand with a warm-cream editorial canvas (#f7f7f4)… |
| `dell-1996` | An inspired interpretation of Dell.com's 1996 design language — a catalog-era enterprise web design built around a literal black page frame, vivid… |
| `elevenlabs` | A voice-AI brand whose marketing surfaces read like a quietly editorial print magazine. The base canvas is off-white (#f5f5f5) holding warm… |
| `expo` | A React Native developer-platform whose marketing site reads like a quietly-confident infrastructure brand. The base canvas is pure white with a soft… |
| `ferrari` | A luxury-automotive brand whose marketing surfaces read as cinematic editorial. The base canvas is near-black (#181818) holding pure white display… |
| `figma` | A confident black-and-white editorial frame interrupted by oversized, hand-cut pastel color blocks. The marketing canvas is rigorously monochrome… |
| `framer` | A confident dark-canvas builder marketing site that treats the page like a working artboard — pure black surfaces, white display type set in GT… |
| `hashicorp` | An enterprise-infrastructure marketing canvas built around a near-black ground (#000000) and a system of per-product accent colors — Terraform… |
| `hp` | An inspired interpretation of HP's design language — a white-paper enterprise-consumer system anchored by HP Electric Blue (#024ad8) as the lone… |
| `ibm` | An enterprise-marketing canvas faithful to Carbon Design System: white surfaces, charcoal type, IBM Blue (#0f62fe) as the single confident accent… |
| `intercom` | An editorial customer-service marketing canvas built around a soft cream-white ground, charcoal type set in Saans (Intercom's proprietary geometric… |
| `kraken` | Kraken's website is a clean, trustworthy crypto exchange that uses purple as its commanding brand color. The design operates on white backgrounds… |
| `lamborghini` | Lamborghini's website is a cathedral of darkness — a digital stage where jet-black surfaces stretch infinitely and every element emerges from the… |
| `linear.app` | A near-black product-focused marketing canvas built around #010102 (the deepest dark surface of any tool in this collection), light gray text… |
| `lovable` | Lovable's website radiates warmth through restraint. The entire page sits on a creamy, parchment-toned background (#f7f4ed) that immediately… |
| `mastercard` | Mastercard's experience reads like a warm, editorial magazine built from soft stone and signal orange. The canvas is a muted putty-cream (#F3F0EE)… |
| `meta` | Meta's design system spans hardware commerce (Quest VR, Ray-Ban Meta AI glasses) and brand surfaces with a confident product-merchandising voice. The… |
| `minimax` | MiniMax presents itself as a premium AI infrastructure brand through a striking duality — bold black-pill CTAs and stark white canvas for marketing… |
| `mintlify` | Mintlify presents documentation infrastructure with a dual-mode aesthetic — atmospheric sky-gradient marketing heroes (cloud illustration backdrops… |
| `miro` | Miro presents itself as the AI-powered visual workspace through a confident, almost playful brand voice — anchored by its signature canary yellow… |
| `mistral.ai` | Mistral AI brands itself with a singular signature — atmospheric sunset gradients (mustard, orange, deep red) layered over photography of mountains… |
| `mongodb` | MongoDB carries a strong dual-mode visual identity — dark deep-teal hero bands with bright MongoDB green ({colors.brand-green}) CTAs paired with… |
| `nike` | / A photography-first commerce system built on extreme typographic contrast — towering uppercase Futura display lockups burned into editorial… |
| `nintendo-2001` | An analysis of Nintendo.com's 2001 design language — a brushed-periwinkle "console chrome" interface where every panel is a beveled metal plate… |
| `notion` | Notion presents itself as the all-in-one workspace through a confident, illustration-rich brand voice — anchored by a deep navy hero band… |
| `nvidia` | / An engineering-grade marketing system organized around two surface modes — a deep black canvas for hero and footer chapters and a flat paper-white… |
| `ollama` | / An almost defiantly minimal documentation-first system that treats the home page like a Markdown README — paper-white canvas, 36px center-aligned… |
| `opencode.ai` | / A terminal-native marketing system rendered entirely in Berkeley Mono — every word on the page, from the hero headline down to the footer fine… |
| `pinterest` | / A photography-first discovery system organized around the Pinterest Red CTA, the masonry pin grid, and a soft warm-cream chrome that gets out of… |
| `playstation` | / A three-surface marketing system organized around alternating black, white, and PlayStation Blue chapters that scroll past the viewer like a… |
| `posthog` | / A playful developer-tools system rendered on a warm cream canvas with hand-drawn hedgehog mascots dotted across every page like marginalia in a… |
| `raycast` | / Raycast's marketing system reads like an extended product screenshot. The chrome IS the in-product chrome at marketing scale: pure-near-black… |
| `renault` | / Renault's web presence pairs the freshly-modernised Renault diamond (the 2021 flat-line rhombus mark) with a stark black-and-white canvas, a… |
| `replicate` | / Replicate's marketing surfaces pair the warm-cream developer-tools aesthetic of an indie ML playground with a confident hot-orange brand accent and… |
| `resend` | / Resend's marketing surfaces sit on a near-pure black canvas with off-white text and a single signature color — the deep editorial-serif Domaine… |
| `revolut` | / Revolut's marketing surfaces pair a stark black canvas with the brand's cobalt-violet (#494fdf) and a wide accent palette of deep, fully-saturated… |
| `runwayml` | Runway's interface is a cinematic reel brought to life as a website — a dark, editorial, film-production-grade design where full-bleed photography… |
| `sanity` | Sanity's website is a developer-content platform rendered as a nocturnal command center -- dark, precise, and deeply structured. The entire… |
| `sentry` | An inspired interpretation of Sentri's design language — a developer-tools brand built on a deep purple-violet midnight canvas, electric lime… |
| `shopify` | An inspired interpretation of Shopifi's design language — a cinematic commerce platform that runs two parallel design tracks. The marketing-hero and… |
| `slack` | An inspired interpretation of Slacc's design language — a workplace messaging brand built on a deep aubergine primary, with cream-lavender hero… |
| `spacex` | An inspired interpretation of Spasex's design language — a mission-oriented aerospace brand built on pure black canvas, full-bleed photographic and… |
| `spotify` | Spotify's web interface is a dark, immersive music player that wraps listeners in a near-black cocoon (#121212, #181818, #1f1f1f) where album art and… |
| `starbucks` | Starbucks' design system is a warm, confident retail flagship wearing the green of their storefront apron across every surface. The canvas alternates… |
| `stripe` | An inspired interpretation of Stripi's design language — a financial-infrastructure brand built on a deep navy ink, an electric indigo primary, and a… |
| `supabase` | An inspired interpretation of Supabaze's design language — an open-source database platform built on a clean white-and-near-black system with a… |
| `superhuman` | An inspired interpretation of Superhumon's design language — a fast-email productivity brand split between an editorial dark hero (deep indigo navy… |
| `tesla` | Tesla's website is an exercise in radical subtraction — a digital showroom where the product is everything and the interface is almost nothing. The… |
| `theverge` | The Verge's 2024 redesign feels like somebody wired a Condé Nast magazine to a chiptune soundboard. The canvas is almost-black (#131313), the… |
| `together.ai` | An inspired interpretation of Together AI's design language — an AI infrastructure platform whose surface alternates between near-black hero bands… |
| `uber` | An inspired interpretation of Uber's design language — a transportation-and-delivery super-app brand whose web surface is a black-and-white duet… |
| `vercel` | An inspired interpretation of Vercel's design language — a developer-platform brand whose surface is a stark black-and-ink duet on near-white canvas… |
| `vodafone` | An inspired interpretation of Vodafone's design language — a telecom super-brand whose web surface alternates between editorial photography hero… |
| `voltagent` | An inspired interpretation of Voltagent's design language — a developer-focused AI agent engineering platform whose surface is an unrelenting… |
| `warp` | An inspired interpretation of Warp's design language — an agentic terminal-and-development-environment brand whose surface is a warm near-charcoal… |
| `webflow` | An inspired interpretation of Webflow's design language — a visual web development platform whose surface contrasts a deep near-black #080808 primary… |
| `wired` | An inspired interpretation of Wired's design language — a flagship technology-magazine brand whose surface is a strict editorial duet of stark black… |
| `wise` | An inspired interpretation of Wise's design language — a global money-transfer brand whose surface combines an unusually heavy near-black display… |
| `x.ai` | An inspired interpretation of xAI's design language — Elon Musk's frontier-AI company whose web surface is a strict near-black canvas broken only by… |
| `zapier` | An inspired interpretation of Zapier's design language — a workflow-automation platform whose surface combines warm-cream neutrals (#fffefb canvas… |

## Attribution

Sourced from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT).
`DESIGN.md` is a convention introduced by Google Stitch. Each file is an
independent analysis of a public website, not an official brand asset.
