# PCM — Physical Confrontation Management

A modern, interactive website for PCM (Physical Confrontation Management), a law enforcement, military, and civilian self-defense training organization in Lebanon, TN led by Chief Instructor Levi Montgomery.

**Live site:** [tacjtg.github.io/pcm](https://tacjtg.github.io/pcm/)

## Tech Stack

- **HTML / CSS / JS** — no frameworks, clean and fast
- **GSAP 3.12.7** + ScrollTrigger — scroll-triggered animations, text reveals, counter animations
- **Three.js r159** — interactive 3D particle field hero with mouse reactivity
- **Lenis 1.1.18** — smooth scrolling, synced with GSAP ScrollTrigger
- **Barba.js 2.10.3** — seamless animated page transitions
- **Custom cursor** — magnetic effect, mix-blend-mode difference, hover scaling

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Homepage — 3D hero, about preview, training cards, stats, testimonials, CTA |
| `about.html` | Bio, career timeline, philosophy, credentials grid |
| `training.html` | 10-course accordion, pricing cards, schedule |
| `contact.html` | Contact form, info, embedded Google Map |

## Project Structure

```
pcm/
├── index.html
├── about.html
├── training.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── main.js           # Lenis, nav, orchestration
│   ├── animations.js     # GSAP ScrollTrigger animations
│   ├── cursor.js         # Custom magnetic cursor
│   ├── three-scene.js    # Three.js particle hero
│   └── transitions.js    # Barba.js page transitions
└── CNAME                 # Custom domain config
```

## Local Development

Serve the files with any static server:

```bash
# Python
python -m http.server 8765

# Node
npx serve .
```

Then open `http://localhost:8765`.

## Deployment

Hosted on GitHub Pages from the `gh-pages` branch. Push changes to `main`, then update `gh-pages`:

```bash
git checkout gh-pages
git merge main
git push origin gh-pages
```

## Features

- **3D particle field** — 2000 particles (800 on mobile) with connecting mesh lines, mouse-reactive rotation
- **Scroll animations** — word-by-word text reveals, fade-ups, counter animations, image reveals
- **Custom cursor** — dot + follower with magnetic snap to interactive elements, hidden on touch devices
- **Page transitions** — overlay scale animation between all pages
- **Responsive** — mobile hamburger menu with clip-path animation, optimized for 375px–1440px+
- **High-contrast hybrid** — dark hero sections with steel blue accents, light content sections
