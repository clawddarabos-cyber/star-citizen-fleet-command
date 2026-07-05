# Frontier Command

A browser prototype for an original fleet-command strategy game using Star Citizen ship names and stat-inspired roles as placeholder data.

This is not a clone of Star Trek Fleet Command. It borrows the broad genre shape: fleet roster, system map, timed operations, mission rewards, repairs, and shipyard progression.

## Current Prototype

- Command dashboard with resources: credits, ore, intel, and quantum fuel
- Clickable system map: Stanton, Pyro, Terra, and Nyx
- Mission cards with duration, power requirement, risk, and rewards
- Stateful fleet deployment with one-second operation timers
- Claim flow that grants rewards, XP, level progress, and hull damage
- Fleet panel with selected ship stats and repairs
- Shipyard commissioning for heavier ships

## Local Dev

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173/
```

## Verification

Last checked on 2026-07-05:

```bash
npm run lint
npm run build
curl -I http://localhost:5173/
```

All passed.

## IP Note

Star Citizen ship names and related concepts are used here as prototype placeholders. Before making this public or commercial, replace them with original factions, ships, art, and lore, or confirm licensing/permission.
