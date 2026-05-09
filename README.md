# Scorched Vibes

A small browser-based artillery tank game inspired by Scorched Earth. This is a parent-and-kid project, so the code is intentionally plain HTML, CSS, and JavaScript: no build tools, no dependencies, and no server required for normal play.

## How To Play

Open `index.html` in a browser.

Controls:

- Start a battle from the setup screen by choosing gravity, terrain, and vertical spread.
- Use the angle and power sliders to aim.
- Choose a weapon with the visual weapon buttons.
- Use `Move Left` / `Move Right` to spend fuel and reposition before firing.
- Press the big `Fire` button or use `Space`.
- Keyboard aiming: `Left` / `Right` adjust angle, `Up` / `Down` adjust power.
- Press `Help` in-game for controls, rules, and weapon descriptions.

The current turn is shown by the thin red or blue line at the bottom of the game board.

## Current Features

- Turn-based Red vs Blue artillery battles.
- Random hilly terrain.
- Pre-game configuration screen.
- Terrain themes:
  - Gentle Hills
  - Mountain Duel
  - Deep Valley
  - Jagged Peaks
  - Plateaus
- Vertical spread settings:
  - Balanced
  - Uneven
  - Extreme
- Destructible craters.
- Wind that changes shot paths.
- Battle gravity modes:
  - Normal
  - Low
  - High
- Angle and power aiming.
- Health and win counters in the top bar.
- Shield and fuel values in the top bar.
- Per-player weapon memory, so each tank keeps its own last-used weapon.
- Shields on each tank. Shield energy absorbs damage before health is damaged.
- Fuel-based movement. Each movement click spends one fuel and fuel is not refilled during the battle.
- Twelve selectable weapons:
  - Baby Missile
  - Big Bomb
  - Cluster Pop
  - Low-G Shot
  - High-G Shot
  - Bouncy Bomb
  - Drill
  - Dirt Mover
  - Teleport Shot
  - Shield Breaker
  - Volcano
  - Gravity Storm
- More detailed tanks with tracks, wheels, hulls, turrets, and barrels.
- Distinct projectile visuals:
  - Big Bomb is larger and spiked.
  - Cluster Pop travels as three linked projectiles.
  - Drill, Dirt Mover, Teleport, Shield Breaker, Volcano, and gravity shots have custom looks.
- One-click visual weapon buttons with small weapon previews.
- Help popup with controls, weapon descriptions, wind, gravity, shield, and fuel basics.
- Tanks are clamped above the turn line at the bottom of the board.
- Drill can cause fall damage when terrain collapses under a tank.
- Shot trails, impact particles, crater flashes, and screen shake.

## Backup Workflow

Before making code changes, copy the current playable files into `Last Version/`.

That folder should contain one recent playable version at a time, so someone can keep playing while new work is underway.

## Progress Log

1. Started with a real-time Tank / Combat-style prototype.
2. Pivoted to a Scorched Earth-style turn-based artillery game.
3. Added random terrain, gravity, wind, craters, health, scoring, and weapons.
4. Improved the HUD by moving health into the top bar.
5. Replaced the bulky turn indicator with a thin board-edge color strip.
6. Fixed player-specific weapon selection.
7. Upgraded tank and projectile visuals.
8. Added configurable battle gravity.
9. Added shield energy and Shield Breaker.
10. Added Low-G Shot, High-G Shot, Bouncy Bomb, Drill, Teleport Shot, Volcano, and Gravity Storm.
11. Replaced the weapon dropdown with visual one-click weapon buttons.
12. Added fuel-based movement and moved shield/fuel into the HUD.
13. Changed shields so they use the tank color and absorb damage before health.
14. Added `Last Version/` backup workflow.
15. Added Help popup.
16. Added pre-game battle configuration.
17. Added terrain themes and vertical spread options.
18. Fixed barrel/trajectory alignment with shared aiming math.
19. Clamped tanks above the bottom turn line.
20. Added drill fall damage.
21. Added Dirt Mover as a terrain-building weapon.

## Ideas To Try Next

- Add a zoom-out mode for the game board so very high shots stay visible and tanks can start farther apart.
- Initialize a GitHub repo.
- Add a weapon shop between battles.
- Let players buy more fuel between battles.
- Add money rewards based on damage or wins.
- Add more weapons:
  - Napalm
  - Laser
  - Banana bomb
- Add terrain themes:
  - Moon visuals
  - Desert visuals
  - Snow visuals
  - Volcano visuals
  - Candy hills visuals
- Add game rule options:
  - Wild wind
  - No wind
  - More health
  - Sudden death
- Add a simple computer opponent.
- Add tank names and color choices.
- Add sound effects.
- Add round summary messages like "direct hit" or "close one."
- Generalize fall damage beyond Drill impacts.
- Add shields, teleporters, or parachutes.

## Design Notes

The game should stay easy to open, easy to change, and fun to experiment with. Prefer small, visible improvements over a big framework. If a new feature can be explained out loud and tested in one battle, it is probably a good fit.
