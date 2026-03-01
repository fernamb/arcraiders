# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ARC Raiders Workshop Tracker — a static web app for tracking workshop upgrade materials for 2 players in the game ARC Raiders. No build step, no backend, no dependencies. Inventory is stored directly in `data.js` (not `localStorage`).

See `plan.md` for the full project spec. The `.xlsx` file contains the raw game data and current inventory counts.

## File Structure

```
index.html     # Structure and layout
style.css      # Dark sci-fi theme
app.js         # All logic and rendering
data.js        # All game data (benches, Scrappy, Blueprints) + current inventory
convert.js     # Dev tool: reads .xlsx and regenerates data.js
package.json   # Only used by convert.js (xlsx dependency)
ARC_Raiders_Workshop_Upgrades.xlsx  # Source of truth for inventory updates
```

## Architecture

- **No server**: Pure static files, deployed via GitHub Pages from `feature/baseline`
- **Data layer (`data.js`)**: Defines all workshop benches (Explosive, Gear, Gunsmith, Medical, Refiner, Utility), Scrappy the Rooster (5 upgrade levels), and Blueprints as JS objects/arrays. Each item has a `qty` (per player) and optional `inv` (current combined inventory)
- **Logic layer (`app.js`)**: Reads from `data.js`, renders UI, computes "Still Required" as `(qty × 2) - inv`
- **No state management library**: Plain DOM manipulation only

## Key Business Logic

- Each item's requirement is doubled to cover both players: `still_required = max(0, qty × 2 - inv)`
- Green = item complete (still_required ≤ 0), Red = still needed
- Progress ring per bench = completed items / total items
- Overview tab shows all benches, Scrappy, and Blueprints in full detail on one scrollable page
- Blueprints: tracked by `inv` count; any `inv > 0` = unlocked

## Inventory Update Workflow

When the player updates the Excel sheet:

1. Save the `.xlsx` file
2. Run `node convert.js` — rewrites BENCHES and SCRAPPY in `data.js` from the Excel (BLUEPRINTS are preserved as-is)
3. Commit and push `data.js`

Blueprint inventory is **not** in the Excel — update `data.js` directly for blueprint `inv` values.

## Deployment

GitHub Pages: Settings → Pages → Branch: `feature/baseline`
