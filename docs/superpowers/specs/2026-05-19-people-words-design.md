# People's Word — UI redesign

**Date:** 2026-05-19  
**Audience:** Clients and collaborators (warmth and personality first)

## Goal

Replace the Telegram-style thread (reactions, fake counts, left/right bubbles) with warm, scannable message cards that match the portfolio's CLI/editor aesthetic.

## Section shell

- Comment: `<!-- People's word -->`
- Title: **People's** `Word` (muted second word)
- Intro (mono): `> feedback.log — from clients and teammates`

## Card layout

Single column, left-aligned. Each card uses `cli-block` styling: `bg-[#141414]`, `border-white/10`, `rounded-md`.

Per card:

1. Header: avatar (40px) + name (semibold) + `· role` + `· date` (muted mono)
2. Divider
3. Quote body (primary text, relaxed line-height)
4. Project line: chip + optional "Visit site" link
5. Scope tags (max 3), neutral chips

## Removed

- Reaction buttons, Lottie, localStorage drift/counts
- Reply-quote blocks
- Left/right chat mirroring
- Telegram bubble chrome

## Home page

- Fix `#people-words` section class: `pb-12` (was broken `pb- fade-left`)

## Data

Keep `MESSAGES` array in component; flatten shape (no `side`, `reply`, `reactions`).
