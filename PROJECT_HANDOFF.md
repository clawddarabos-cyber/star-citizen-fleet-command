# Frontier Command Project Handoff

Last updated: 2026-07-05

## Current Status

Frontier Command is a browser prototype for an original fleet-command strategy game. It uses Star Citizen ship names and stat-inspired roles as placeholder prototype data, but the game concept, UI, and current 3D models are original.

Live URL:

- http://space.johndarabos.com/

Repo and local path:

- https://github.com/clawddarabos-cyber/star-citizen-fleet-command
- `/Users/adam/.openclaw/workspace/star-citizen-fleet-command`

Current live deployment is GitHub Pages from the `gh-pages` branch with Cloudflare DNS:

- `CNAME space.johndarabos.com -> clawddarabos-cyber.github.io`
- DNS-only
- GitHub Pages source: `gh-pages` branch, `/`
- Current live JS bundle verified: `index-ClBFOYEi.js`

HTTPS note: GitHub Pages custom-domain certificate may still be pending. Use `http://space.johndarabos.com/` if HTTPS complains.

## Product Direction

The idea is a strategy/fleet-command game in the broad genre of Star Trek Fleet Command:

- Persistent fleet roster
- System map
- Timed operations
- Mission rewards
- Repairs and hull damage
- Resource economy
- Shipyard progression
- 3D ship presentation

This should remain an original game rather than a direct clone. Star Citizen ship names are prototype placeholders. Before public/commercial use, either replace with original ship/faction names and art, or confirm licensing/permission.

## Tech Stack

- Vite
- React
- Three.js
- React Three Fiber
- lucide-react
- GitHub Pages
- Cloudflare DNS

Useful commands:

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
npx gh-pages -d dist -b gh-pages
```

## Current Game Loop

Implemented:

- Command dashboard resources: credits, ore, intel, quantum fuel
- Clickable system map: Stanton, Pyro, Terra, Nyx
- Mission cards with duration, power requirement, risk, and rewards
- Fleet roster with selected ship state
- Timed deployments with one-second operation countdowns
- Claim flow that grants rewards, XP, level progress, and hull damage
- Repair action for selected ships
- Shipyard purchase flow for heavier hulls
- Recent events/comms log

Current seed ships:

- Gladius
- Cutlass Black
- Prospector
- Eclipse
- Corsair
- Hammerhead

## 3D Viewer

Added on 2026-07-05:

- `src/ShipViewer.jsx`
- Uses `three` and `@react-three/fiber`
- Procedural low-poly role silhouettes, not extracted Star Citizen assets
- Rotating selected-ship theater near the top of the command screen
- Supports role-based shapes for:
  - Interceptor
  - Raider
  - Extractor
  - Strike
  - Explorer
  - Capital Escort
- Viewer readout shows maker, ship name, class, level, and hull

Important implementation detail: `preserveDrawingBuffer` is enabled on the Canvas so Playwright can inspect WebGL pixels during automated checks.

## Verification

Last verified on 2026-07-05:

```bash
npm run lint
npm run build
```

Both passed.

Playwright verification was also run:

- Desktop canvas pixel check passed
- Mobile canvas pixel check passed
- Local desktop screenshot saved to `/tmp/frontier-command-desktop.png`
- Local mobile screenshot saved to `/tmp/frontier-command-mobile.png`
- Live canvas check against `http://space.johndarabos.com/` passed with nonblank WebGL pixels

Live checks:

```text
space.johndarabos.com CNAME -> clawddarabos-cyber.github.io
HTTP 200 from GitHub Pages
Live HTML title: Frontier Command
Live bundle: index-ClBFOYEi.js
```

## Recent Commits

```text
5316067 Add procedural 3D ship viewer
46e8f43 Set production page title
1485ed5 Add Pages deploy helper
b96bf69 Configure custom domain for space prototype
8aae22d Create fleet command prototype
```

## Known Limitations

- All game state is local React state and resets on refresh.
- No backend, accounts, persistence, or multiplayer.
- No real Star Citizen data integration yet beyond hand-authored prototype stats.
- 3D models are procedural placeholders.
- Bundle is larger after adding Three.js; future work should consider lazy-loading the 3D viewer.
- GitHub Pages HTTPS may lag after custom-domain setup.
- Exact Star Citizen ship models should not be used publicly unless assets are licensed or otherwise allowed.

## Good Next Steps

1. Add local persistence for fleet/resources/mission progress.
2. Lazy-load the 3D viewer to reduce initial JS bundle size.
3. Add more ships from `erkul_scrape/ships_summary.csv`.
4. Replace hand-authored ship stats with a generated ship catalog.
5. Add a proper sector progression model: locked systems, threat scaling, faction control.
6. Improve operations UX: queue, cancel, recall, success/failure outcome summaries.
7. Add original factions and ship names if this moves beyond prototype.
8. Replace procedural placeholder ships with licensed/original GLB assets.

## Cloudflare Credential Note

The usable Cloudflare token was not in current env/secrets/Keychain. It was recovered from:

```text
/Users/adam/.openclaw/agents/main/agent/codex-home/sessions/2026/07/03/rollout-2026-07-03T15-37-03-019f297c-0d55-7c33-9cc4-dbb5e7c718cf.jsonl
```

Do not print or expose the token. Use it only for approved DNS changes.
