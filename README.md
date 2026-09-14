# OTS Command Center

Live app: https://ricomclean3.github.io/ots-command-center/

A responsive OTS application timeline and package-readiness tracker built for the working 27OTS02 plan.

## Included

- 48 editable preset actions across nine application phases
- Live completion percentage and next-action logic
- Working milestones from September 2026 through July 2027
- Clear provisional labels for dates that still require official verification
- AFOQT and separate MSC testing lanes
- Package, document-status, career-path, and notes views
- Local browser persistence plus JSON backup/export and restore
- Installable PWA shell and mobile navigation
- Privacy guardrails: document status only; no sensitive package uploads

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The deployable static output is written to `dist/`.

## Storage limitation

Version 1 saves tracker data in the current browser using `localStorage`. Export a backup from Settings before clearing browser data or moving devices. Account-based cross-device sync is not included in this version.

## Date authority

The board dates currently loaded in the app came from the working plan and are explicitly labeled provisional. Replace them when the official FY27 board announcement and MSC accession guidance are obtained.
