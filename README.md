# Alexey Minakov - Portfolio

Personal portfolio website showcasing software development projects across backend, IoT, and web technologies.

**Live site**: [goodalex223.github.io](https://goodalex223.github.io)

---

## Overview

A modern, responsive portfolio built with vanilla HTML, CSS, and JavaScript. Features a dark theme, accessible design, and showcases projects across multiple domains including backend development, IoT/hardware, and web applications.

---

## Quick Start

### Prerequisites

- A web browser
- (Optional) Local server for development (e.g., Live Server VS Code extension)

### Running Locally

```bash
# Clone the repository
git clone https://github.com/GoodAlex223/goodalex223.github.io.git
cd goodalex223.github.io

# Open in browser
# Option 1: Direct file
open index.html

# Option 2: Using Python server
python -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Using VS Code Live Server extension
# Right-click index.html -> Open with Live Server
```

---

## Project Structure

```
goodalex223.github.io/
├── index.html              # Main portfolio page
├── css/                    # Stylesheets
│   ├── variables.css       # Design tokens
│   ├── reset.css           # CSS reset
│   ├── utilities.css       # Utility classes
│   ├── components.css      # UI components
│   └── main.css            # Main styles
├── js/
│   └── main.js             # JavaScript
├── frontendmentor/         # Frontend Mentor projects
├── freecodecamp/           # FreeCodeCamp projects
├── MDN/                    # MDN learning projects
├── other/                  # Other projects
├── docs/                   # Documentation
├── PROJECT.md              # Project configuration
└── README.md               # This file
```

---

## Features

- **Dark Theme**: Professional dark color scheme
- **Responsive**: Mobile-first design (375px to 1920px+)
- **Accessible**: Skip links, focus states, reduced motion support
- **Fast**: No frameworks, minimal dependencies
- **SEO Ready**: Meta tags, Open Graph, semantic HTML

---

## Featured Projects

| Category | Project | Technologies |
|----------|---------|--------------|
| Backend | rating_bot | Python, PostgreSQL, Redis, Docker |
| IoT | Industrial Rule Indicators | C++, Arduino, RTC, DS18B20 |
| IoT | Automatic Machine Lubrication | C++, Arduino, MOSFET |
| IoT | HX711 Multi-Scale System | C++, Arduino, HX711 |
| Web | E-commerce Prototype | TypeScript, React, Vercel |
| Tools | SVG Layer Processor | Python, CairoSVG |

---

## Documentation

| Document | Description |
|----------|-------------|
| [docs/README.md](docs/README.md) | Documentation index |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | CSS/HTML architecture |
| [docs/planning/TODO.md](docs/planning/TODO.md) | Current tasks |
| [PROJECT.md](PROJECT.md) | Project configuration |

---

## Development

### CSS Architecture

The CSS follows a modular architecture:

1. **variables.css** - Design tokens (colors, spacing, typography)
2. **reset.css** - Normalize browser styles
3. **utilities.css** - Reusable utility classes
4. **components.css** - UI components (cards, buttons)
5. **main.css** - Layout and page-specific styles

### Adding a New Project

1. Add project card HTML to `index.html` in the projects section
2. Set appropriate `data-category` attribute
3. Include GitHub and optional demo/Wokwi links

---

## Deployment

The site is deployed via GitHub Pages from the `main` branch.

```bash
# Deploy (automatic via GitHub Pages)
git add .
git commit -m "Update portfolio"
git push origin main
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## License

MIT License

---

## Contact

- **Email**: alexminak32@gmail.com
- **GitHub**: [GoodAlex223](https://github.com/GoodAlex223)
- **LinkedIn**: [Alexey Minakov](https://www.linkedin.com/in/alexey-minakov-302457168)
- **Telegram**: [@GoodAlex223](https://t.me/GoodAlex223)
