# MAC — Portfolio Website

A modern, minimalist personal portfolio website built with HTML, CSS, and JavaScript. Features an interactive Three.js 3D background, smooth animations, and a responsive layout.

## Technologies Used

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **JavaScript (Vanilla)** — Intersection Observer, carousel, form validation
- **Three.js** — Interactive 3D particle background with mouse and scroll interaction
- **Google Fonts** — Inter (body), Oswald (headings)

## File Structure

```
portfolio/
├── index.html          # Main HTML file with all sections
├── style.css           # Complete stylesheet
├── script.js           # JavaScript (Three.js, animations, carousel, form)
├── README.md           # This file
└── assets/
    ├── images/         # Placeholder images (replace with your own)
    └── icons/          # Reserved for future icon assets
```

## How to Run

1. Clone or download this repository.
2. Open **index.html** directly in your browser.
3. No build tools or servers required.

## Where to Replace Images

Open `index.html` and search for these TODO comments:

| Image | Location | Comment |
|---|---|---|
| Hero photo | `assets/images/hero-placeholder.png` | `<!-- TODO: Replace this with your real hero photo -->` |
| About photo | `assets/images/about-placeholder.png` | `<!-- TODO: Replace this with your real about/profile photo -->` |
| Project 1 | `assets/images/project-1-placeholder.png` | `<!-- TODO: Replace this with your real project screenshot -->` |
| Project 2 | `assets/images/project-2-placeholder.png` | `<!-- TODO: Replace this with your real project screenshot -->` |
| Project 3 | `assets/images/project-3-placeholder.png` | `<!-- TODO: Replace this with your real project screenshot -->` |

## Where to Replace Links

Search for `YOUR_..._LINK_HERE` in `index.html` and replace with your actual URLs:

| Link | Search for |
|---|---|
| Resume PDF | `YOUR_RESUME_LINK_HERE` |
| LinkedIn | `YOUR_LINKEDIN_LINK_HERE` |
| GitHub | `YOUR_GITHUB_LINK_HERE` |
| Facebook | `YOUR_FACEBOOK_LINK_HERE` |
| Project 1 | `YOUR_PROJECT_1_LINK_HERE` |
| Project 2 | `YOUR_PROJECT_2_LINK_HERE` |
| Project 3 | `YOUR_PROJECT_3_LINK_HERE` |

## Three.js Background

The Three.js background is loaded from CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```

It features:
- Floating particles with connecting lines
- Wireframe geometric shapes (sphere, torus, cube, octahedron)
- Mouse cursor interaction (camera tilt)
- Scroll-based rotation and depth movement
- Reduced particle count on mobile for performance

## Customization

- **Colors**: Edit CSS variables in `:root` in `style.css`
- **Content**: Edit text in `index.html`
- **Three.js**: Adjust particle count, colors, and animation speed in `initThreeBackground()` in `script.js`

## Notes

- This is a client-side only project — the contact form shows a success message on submit but does not send data to a server.
- All images are placeholder PNGs. Replace them with your own photos and screenshots.
- Works best in modern browsers (Chrome, Firefox, Safari, Edge).
