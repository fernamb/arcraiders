# ARC Raiders Workshop Tracker — Project Summary

## Project Overview
A static web app to track workshop upgrade materials for 2 players in ARC Raiders.
No server or backend required. Player inventory saves locally in the browser via localStorage.

---

## File Structure
```
arc-raiders-tracker/
├── index.html   # Structure and layout
├── style.css    # Dark sci-fi theme
├── app.js       # All logic, rendering, localStorage
└── data.js      # All game data (benches + Scrappy)
```

---

## Features Built
- 6 workshop benches: Explosive, Gear, Gunsmith, Medical, Refiner, Utility
- Scrappy the Rooster — all 5 upgrade levels
- Player 1 / Player 2 toggle — separate localStorage per player
- Inventory input per item
- Still Required auto-calculates: `(qty × 2) - inventory`
- Green = done, Red = still needed
- Progress bar per bench (% complete)
- Summary tab — all benches at a glance

---

## Current Inventory (Player 1 — already entered)
| Item | Have |
|---|---|
| ARC Motion Core | 10 ✅ |
| Toaster | 6 ✅ |
| ARC Circuitry | 20 ✅ |
| Bombardier Cell | 0 |
| Damaged Heat Sink | 3 |
| Fried Motherboard | 4 |
| Leaper Pulse Unit | 5 |
| Rocketeer Driver | 2 |
| Durable Cloth | 10 ✅ |
| Rusted Shut Medical Kit | 3 |
| Surveyor Vault | 3 |
| Antiseptic | 5 |
| Power Cable | 5 |
| Advanced Electrical Components | 5 |
| Bastion Cell | 11 |
| Rusted Tools | 6 ✅ |
| Rusted Gear | 3 |

---

### 7. Enable GitHub Pages
- GitHub.com → your repo → Settings → Pages
- Branch: main → Save
- Live at: `https://YOURUSERNAME.github.io/arc-raiders-tracker`

---

## Future Ideas
- Live sync between players (Firebase or Supabase)
- Tick to mark full bench level complete
- Per-raid farming checklist
- Push notifications when a bench is ready

---

## Notes
- Inventory data is stored in the browser locally — not in the repo
- Repo can be public (safe — no sensitive data in the code)
- Come back to Claude with this file to continue where we left off