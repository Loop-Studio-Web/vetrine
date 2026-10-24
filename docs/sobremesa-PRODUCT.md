# Product

<!-- impeccable:product-schema 1 -->

> Scope: this file describes ONE demonstration storefront, the E-commerce "Editorial" concept (level 3, "Esperienza") of the
> Loop Studio vetrine repo, built on branch `prova-impeccable-editoriale`. The repo itself holds independent concepts; this
> record must not steer any other concept. Moved to `docs/sobremesa-PRODUCT.md` after the experiment (2026-10-24).

## Platform

web

## Users

People of 28-45 who furnish a home or choose gifts, reading in the Río de la Plata (Argentina) market. They arrive to read, not
to shop: they take in a story about a room or a laid table, and buy one or two objects they have already seen in the scene
(housewarming gift, first flat, a table for guests). The story comes before the product.

## Product Purpose

An online shop that is also a magazine: a "negocio editorial shoppable" selling authored home-and-table objects (ceramics,
glass, textiles, utensils, lamps, small furniture). Each story shows a room or a table; every object in the scene can be
bought from inside the story, not from a separate catalogue. Success: the visitor reads, recognises an object in a scene,
and adds it to the bag without leaving the story.

## Positioning

The catalogue lives inside the editorial content: stories are the way into the stock. A neighbouring shop (grid of products
with filters, or a blog next to a shop) could not claim that the unit of browsing is the scene, not the product.

## Operating Context

Spanish, Río de la Plata voice (voseo). Prices in Argentine pesos (ARS), with the shop's free-shipping threshold and delivery
in days shown as fictional example data. Payments appear as fake buttons with an explicit statement that no payment is real
(repo rule for e-commerce concepts). Backend logic is not part of the demo; the commercial level (Esperienza) implies a custom
engine behind the shop, never named on public pages.

## Capabilities and Constraints

- Static Astro site (`output: 'static'`), one homepage plus the studio's usual `info` page; not a multi-page shop.
- Must include: purchase from inside the story (tap an object in a scene and it reaches the bag), a bag/cart, fake checkout.
- Must NOT be a filterable product catalogue with side drawer (already built in another concept) nor a "tool plus receipt"
  flow (over-used in the portfolio).
  *Decision recorded 2026-10-24 (the author asked for it after seeing the first draft):* a secondary "Depósito" section
  (13 objects, colour dots) with a left filter drawer was added below the shelf. It is an accepted exception: the scene stays
  the unit of browsing in the hero and the shelf; the Depósito only answers "what else is there" and is labelled as a mock-up
  of a 360-object catalogue.
- Level 3 (Esperienza): the most ambitious of the three E-commerce concepts; Spanish text; language code ES.
- Demonstration only: `noindex, nofollow`; names, prices, stock, addresses, reviews and article text are fictional and
  declared "de ejemplo"; no real third-party brands or logos.
- Images are local only (astro:assets), from free sources with credits (Unsplash `images.unsplash.com/photo-…`, Pexels,
  Pixabay); no hotlinking; no watermarks; AI-generated imagery only as a declared, labelled material.
- Return strip on top ("vetrina dimostrativa · concept di Loop Studio"), footer with the studio logo and link.
- Open decisions: the shop's name (invented, searched on the web for obvious collisions), the exact number of stories and
  objects, the choice of the image sources, the visual world (not decided here).

## Brand Commitments

None yet: the shop's name, voice and identity are open. Binding repo rules inherited from the author (recorded, not
expanded): no beige, cream or ivory as a base colour; no "made by AI" look; palette must differ from the other E-commerce
concepts in brightness and hue (Chioma Saracena, Soft Riot); structure, material and gesture must not repeat the matrix in
`docs/ispirazioni.md`.

## Evidence on Hand

No real shop, customers, photographs of the actual objects, testimonials or sales data exist. Everything the page shows is
demonstration material and stays labelled as such. Photographs will come from free libraries; if objects must be shown in
scenes, scene photos stand in for them.

## Product Principles

1. The scene is the unit of browsing; the product is found inside it, never beside it.
2. Reading comes first: the visitor must be able to read a story without being sold to, and still find the way to buy.
3. Everything fictional is declared as example; nothing implies a real shop, price, or payment.
4. A tap on an object must always result in something visible (bag count, confirmation), also on a phone.
5. Spanish of the Río de la Plata is a real voice, not a translation of an Italian or neutral text.

## Accessibility & Inclusion

WCAG 2.2 AA is the studio standard: keyboard-operable scene hotspots with text alternatives, visible focus, no hover-only
actions, reduced-motion respected, contrast checked in light and dark theme. Touch targets sized for thumbs.
