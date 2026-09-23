# 🕹️ Pac-Man Arcade Classic

A browser-based Pac-Man clone built with vanilla HTML5 Canvas, CSS, and JavaScript. Features a retro neon arcade landing page, classic maze gameplay, ghost AI, sound effects, and a clean object-oriented architecture.

---

## 🎮 Live Demo

Open `index.html` in your browser to start (or use a local server like `Live Server` for best results with asset loading).

---

## 📁 Project Structure

```
pacman/
├── index.html          # Landing page (retro arcade home screen)
├── index.js            # Landing page JS (BGM toggle)
├── pacman.css          # Shared stylesheet (landing page + game screen)
├── pacman.js           # Core game logic & entity classes
├── pages/
│   └── game-screen.html  # Game canvas screen
├── images/
│   ├── hero-banner.png   # Landing page hero banner
│   ├── pacmanUp.png      # Pac-Man directional sprites
│   ├── pacmanDown.png
│   ├── pacmanLeft.png
│   ├── pacmanRight.png
│   ├── redGhost.png      # Ghost sprites
│   ├── pinkGhost.png
│   ├── blueGhost.png
│   ├── orangeGhost.png
│   ├── scaredGhost.png
│   ├── wall.png          # Wall tile
│   ├── cherry.png        # Bonus items (unused)
│   └── cherry2.png
├── audio/
│   ├── start-music.mp3             # Landing page BGM
│   ├── pacman-eating-food-dots.mp3 # Eating sound effect
│   ├── fail.mp3                    # Ghost collision sound
│   ├── ghost - normal-move.mp3     # Ghost ambient sound
│   └── ghost-spurt-move-#1–4.mp3  # Ghost movement variants
└── README.md
```

---

## 🏗️ Architecture

### Entity Class Hierarchy

The game uses an object-oriented class hierarchy instead of a single generic `Block` class:

```
Entity (base: image, x, y, width, height, draw())
├── Wall        — Static wall tile, rendered from wall.png
├── Food        — Static pac-dot, drawn as a yellow filled rectangle
└── Character   (adds: direction, velocity, updateDirection(), updateVelocity())
    ├── Pacman  — Handles directional sprite switching on movement
    └── Ghost   — Stores ghost name/type (red, pink, blue, orange)
```

### Key Modules

| File | Purpose |
|------|---------|
| `index.html` | Retro arcade landing page with hero section, ghost roster, controls guide, and BGM toggle |
| `index.js` | Landing page interactivity — background music play/pause control |
| `pacman.css` | Full design system — CSS variables, retro fonts (Press Start 2P), neon glows, glassmorphism cards, game board styling |
| `pacman.js` | Core game engine — map loading, rendering, movement, collision detection, ghost AI, audio, win condition |
| `pages/game-screen.html` | Game canvas page with score display, back-to-menu button, and sound toggle |

---

## 🎯 Game Features

### Implemented

- **21×19 Tile Map** — Classic Pac-Man maze layout loaded from a string-based tile map
- **Pac-Man Movement** — Smooth grid-based movement via keyboard (WASD / Arrow Keys)
- **Directional Sprites** — Pac-Man sprite changes based on facing direction
- **4 Ghosts** — Blinky (red), Pinky (pink), Inky (blue), Clyde (orange)
- **Ghost AI** — Ghosts evaluate open paths at intersections and avoid reversing direction
- **Collision Detection** — AABB collision between all entities
- **Food Collection** — Dots are consumed on contact, incrementing the score
- **Tunnel Wrapping** — Pac-Man and ghosts can wrap around through left/right tunnels
- **Sound Effects** — Continuous eating sound that plays/pauses dynamically based on dot collision
- **Win Condition** — Alert triggered when all food dots are eaten
- **Respawn on Ghost Hit** — Pac-Man and ghosts reset to starting positions on collision
- **Landing Page** — Retro 80s arcade-styled home screen with animated dot track and ghost descriptions

### Planned / Not Yet Implemented

- [ ] **Lives System** — 3 lives per session; losing all lives triggers Game Over
- [ ] **Game Over Screen** — Dedicated end screen with final score and restart option
- [ ] **Power Pellets** — Large pellets that trigger scared ghost mode; ghosts become vulnerable and can be eaten for bonus points
- [ ] **Per-Ghost Unique AI** — Each ghost gets its own personality:
  - 🔴 **Blinky (Red)** — Directly chases Pac-Man's current tile
  - 🩷 **Pinky (Pink)** — Ambushes by targeting 4 tiles ahead of Pac-Man
  - 🩵 **Inky (Blue)** — Unpredictable; uses Blinky's position to calculate its target
  - 🟠 **Clyde (Orange)** — Chases when far, retreats to corner when close
- [ ] **Score Persistence** — Save and restore score across sessions using `localStorage`
- [ ] **Player Dashboard** — A dedicated stats page showing:
  - Total games played and best score
  - Average dots eaten per run
  - Ghost collision count (mistakes tracker)
  - Behavioral analysis: aggression vs caution ratio, preferred movement patterns, reaction time trends
- [ ] **Multiple Maps** — Swap the tile map string to load different maze layouts (e.g. Classic, Mini, Spiral)
- [ ] **Mobile Touch Controls** — On-screen directional buttons for mobile play

---

## 🕹️ Controls

| Action | Keys |
|--------|------|
| Move Up | `W` / `↑` |
| Move Down | `S` / `↓` |
| Move Left | `A` / `←` |
| Move Right | `D` / `→` |

---

## 🗺️ Tile Map Legend

The maze is defined as a 21×19 grid of characters in `pacman.js`:

| Character | Entity |
|-----------|--------|
| `X` | Wall |
| ` ` (space) | Food dot |
| `O` | Empty / skip (tunnel area) |
| `P` | Pac-Man spawn |
| `r` | Red ghost (Blinky) |
| `p` | Pink ghost (Pinky) |
| `b` | Blue ghost (Inky) |
| `o` | Orange ghost (Clyde) |

---

## 🚀 How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/RITISHM/pacman.git
   cd pacman
   ```

2. Open with a local server (recommended for proper asset loading):
   ```bash
   # Using VS Code Live Server, or:
   npx serve .
   ```

3. Navigate to `http://localhost:3000` (or wherever your server runs).

4. Click **"INSERT COIN - PLAY NOW"** on the landing page to start the game!

---

## 🛠️ Tech Stack

- **HTML5 Canvas** — Game rendering
- **Vanilla CSS** — Styling with CSS variables, Google Fonts (Press Start 2P, Outfit), neon glow effects
- **Vanilla JavaScript** — Game logic, OOP class hierarchy, DOM manipulation
- **No frameworks or build tools** — Pure browser-native implementation

---

## 📄 License

This project is inspired by the original Pac-Man game by Namco. Built for educational purposes.