# Adventra Style Guide (V1)

## Color Scheme (Earth-Tone Inspired)

| Purpose           | Hex Code  | Notes                                         |
|-------------------|-----------|-----------------------------------------------|
| **Primary**       | `#3d6f4f` | Earthy Green – Calm, grounded, adventurous    |
| **Primary Light** | `#7ea98b` | Soft Pastel Green – Buttons, accents          |
| **Secondary**     | `#d99a61` | Sand Amber – Warm, energetic highlights       |
| **Tertiary**      | `#476b89` | Dusty Blue – Stability, cool contrast         |
| **Background**    | `#f2ede8` | Soft Beige – Neutral, clean background        |
| **Foreground**    | `#232323` | Deep Charcoal – Strong text on light bg       |
| **Text**          | `#1f1f1f` | Dark Gray – Readable, modern                  |

---

## Font Scheme

| Usage        | Font Stack                    |
|--------------|-------------------------------|
| **Headings** | `'Montserrat', sans-serif`    |
| **Body**     | `'Lexend', sans-serif`        |

> These fonts are loaded via **Google Fonts CDN** in `_document.js` for seamless usage.

---

## Usage Notes
- Colors and fonts are defined in `:root` using **CSS variables** inside `globals.css`.
- Use `var(--primary)` or other variables in inline styles or custom utility classes.
- Tailwind hover effects use **`--primary`** for contrast on **`--primary-light`** backgrounds.
