# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ARC Raiders Workshop Tracker — a static web app for tracking workshop upgrade materials for 2 players in the game ARC Raiders. No build step, no backend, no dependencies. Player inventory persists to `localStorage`.

See `plan.md` for the full project spec. The `.xlsx` file contains the raw game data.

## File Structure

```
index.html   # Structure and layout
style.css    # Dark sci-fi theme
app.js       # All logic, rendering, localStorage
data.js      # All game data (benches + Scrappy)
```

## Architecture

- **No server**: Pure static files, deployable directly via GitHub Pages
- **Data layer (`data.js`)**: Defines all workshop benches (Explosive, Gear, Gunsmith, Medical, Refiner, Utility) and Scrappy the Rooster (5 upgrade levels) as JS objects/arrays
- **Logic layer (`app.js`)**: Reads from `data.js`, handles Player 1/2 toggle (separate `localStorage` keys per player), renders UI, and computes "Still Required" as `(qty × 2) - inventory`
- **No state management library**: Plain DOM manipulation and `localStorage` only

## Key Business Logic

- Each item's requirement is doubled to cover both players: `still_required = (qty × 2) - player_inventory`
- Green = item complete (still_required ≤ 0), Red = still needed
- Progress bar per bench = completed items / total items for that bench
- Summary tab shows all benches at a glance

## Deployment

GitHub Pages: Settings → Pages → Branch: main
