# Typefaces

All-sans, minimalist — no serif in the current direction. Both
typefaces load via `next/font/google` in `lib/fonts.ts`; no licensed
files to place here.

```
Montserrat  — heading, display, hero (weights 400/500/600)
Manrope     — body, UI, caption, fact
```

## Requirements, in priority order

1. Full Latin Extended-A — Indonesian diacritics and long compound
   words must set cleanly.
2. True tabular lining figures — specification blocks align without
   manual intervention.
3. A geometric, minimalist display face for the hero/heading register;
   a humanist workhorse for everything read at length.

## History

An earlier direction paired a licensed serif (Lyon Text) with a
licensed grotesque (Neue Haas Grotesk), with Source Serif 4 + Manrope
as the documented Google Fonts fallback. The studio's current
direction drops the serif entirely in favour of an all-sans system —
see `lib/fonts.ts`.

## Not used

Söhne and Suisse Int'l are deliberately avoided. Both are excellent and
both are the current default of the studios this site is positioned
against.
