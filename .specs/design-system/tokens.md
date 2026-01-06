# Design Tokens - Tetris

**Status**: ✅ Customized for Tetris
**Last Updated**: 2026-01-06
**Theme**: Retro Arcade / CRT Aesthetic

This design system creates a nostalgic arcade feel with neon colors against dark backgrounds, CRT-inspired effects, and pixel-perfect precision.

---

## Colors

### Game Background

| Token | Value | Usage |
|-------|-------|-------|
| `color-void` | `#0a0a0f` | Deep space black, main background |
| `color-grid-bg` | `#12121a` | Game board background |
| `color-grid-line` | `#1e1e2e` | Grid lines within board |
| `color-chrome` | `#16161e` | UI panel backgrounds |

### Tetromino Colors (Guideline Standard)

| Token | Value | Shape | Preview |
|-------|-------|-------|---------|
| `color-piece-i` | `#00f5ff` | I-piece (cyan) | ████ |
| `color-piece-o` | `#ffd700` | O-piece (yellow) | ▓▓ |
| `color-piece-t` | `#bf00ff` | T-piece (purple) | ▓▓▓ |
| `color-piece-s` | `#00ff66` | S-piece (green) | ▓▓ |
| `color-piece-z` | `#ff3366` | Z-piece (red) | ▓▓ |
| `color-piece-j` | `#3366ff` | J-piece (blue) | ▓ |
| `color-piece-l` | `#ff9933` | L-piece (orange) | ▓ |

### Piece Glow Effects

| Token | Value | Usage |
|-------|-------|-------|
| `glow-i` | `0 0 20px #00f5ff, 0 0 40px #00f5ff50` | I-piece glow |
| `glow-o` | `0 0 20px #ffd700, 0 0 40px #ffd70050` | O-piece glow |
| `glow-t` | `0 0 20px #bf00ff, 0 0 40px #bf00ff50` | T-piece glow |
| `glow-s` | `0 0 20px #00ff66, 0 0 40px #00ff6650` | S-piece glow |
| `glow-z` | `0 0 20px #ff3366, 0 0 40px #ff336650` | Z-piece glow |
| `glow-j` | `0 0 20px #3366ff, 0 0 40px #3366ff50` | J-piece glow |
| `glow-l` | `0 0 20px #ff9933, 0 0 40px #ff993350` | L-piece glow |

### UI Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color-accent-primary` | `#00f5ff` | Primary UI accents, score |
| `color-accent-secondary` | `#ff3366` | Secondary accents, warnings |
| `color-accent-success` | `#00ff66` | Line clears, achievements |
| `color-accent-gold` | `#ffd700` | High scores, special events |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `color-text-primary` | `#ffffff` | Primary text |
| `color-text-secondary` | `#8888aa` | Labels, secondary info |
| `color-text-dim` | `#444466` | Disabled, ghost text |
| `color-text-glow` | `#00f5ff` | Glowing text effect |

### Ghost Piece

| Token | Value | Usage |
|-------|-------|-------|
| `color-ghost` | `rgba(255, 255, 255, 0.15)` | Ghost piece fill |
| `color-ghost-border` | `rgba(255, 255, 255, 0.3)` | Ghost piece outline |

---

## Typography

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `font-display` | `'Press Start 2P', 'Courier New', monospace` | Headings, score, game text |
| `font-mono` | `'JetBrains Mono', 'Consolas', monospace` | Labels, stats |
| `font-body` | `'Inter', system-ui, sans-serif` | Instructions, descriptions |

### Font Sizes (Pixel-Perfect Scale)

| Token | Value | Usage |
|-------|-------|-------|
| `text-xs` | `8px` | Tiny labels |
| `text-sm` | `10px` | Small labels |
| `text-base` | `12px` | Base UI text |
| `text-lg` | `14px` | Important labels |
| `text-xl` | `16px` | Panel headers |
| `text-2xl` | `20px` | Score display |
| `text-3xl` | `24px` | Level display |
| `text-4xl` | `32px` | Game over text |
| `text-5xl` | `48px` | Title |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `font-normal` | `400` | Body text |
| `font-bold` | `700` | Emphasis |

---

## Game Grid

### Cell Dimensions

| Token | Value | Usage |
|-------|-------|-------|
| `cell-size` | `28px` | Single cell size |
| `cell-gap` | `1px` | Gap between cells |
| `cell-radius` | `2px` | Cell corner rounding |

### Board Dimensions

| Token | Value | Usage |
|-------|-------|-------|
| `board-width` | `10` | Columns (cells) |
| `board-height` | `20` | Visible rows (cells) |
| `board-buffer` | `2` | Hidden rows above |

### Preview Box

| Token | Value | Usage |
|-------|-------|-------|
| `preview-cells` | `4` | Preview box size (4x4) |
| `preview-scale` | `0.8` | Preview piece scale |

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-0` | `0` | No spacing |
| `spacing-1` | `4px` | Tight |
| `spacing-2` | `8px` | Small |
| `spacing-3` | `12px` | Compact |
| `spacing-4` | `16px` | Default |
| `spacing-6` | `24px` | Medium |
| `spacing-8` | `32px` | Large |
| `spacing-12` | `48px` | Section |

---

## Border & Effects

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | `0` | Sharp corners |
| `radius-sm` | `2px` | Cells |
| `radius-md` | `4px` | Panels |
| `radius-lg` | `8px` | Cards |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `border-panel` | `2px solid #2a2a3e` | Panel borders |
| `border-grid` | `1px solid #1e1e2e` | Grid lines |
| `border-glow` | `2px solid #00f5ff` | Active/focus states |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-panel` | `0 4px 24px rgba(0, 0, 0, 0.5)` | Panel shadow |
| `shadow-piece` | `0 2px 8px rgba(0, 0, 0, 0.3)` | Falling piece |
| `shadow-glow` | `0 0 30px rgba(0, 245, 255, 0.3)` | Glow effect |

### CRT Effects

| Token | Value | Usage |
|-------|-------|-------|
| `scanline-opacity` | `0.03` | Scanline overlay |
| `vignette-intensity` | `0.4` | Corner darkening |
| `noise-opacity` | `0.02` | Subtle noise |

---

## Animation

### Timing

| Token | Value | Usage |
|-------|-------|-------|
| `duration-instant` | `50ms` | Piece movement |
| `duration-fast` | `100ms` | Quick feedback |
| `duration-normal` | `200ms` | Standard transitions |
| `duration-slow` | `400ms` | Line clear animation |
| `duration-crawl` | `800ms` | Game over sequence |

### Game Speed (ms per row drop)

| Token | Level | Value |
|-------|-------|-------|
| `speed-level-1` | 1 | `1000ms` |
| `speed-level-5` | 5 | `600ms` |
| `speed-level-10` | 10 | `300ms` |
| `speed-level-15` | 15 | `150ms` |
| `speed-level-20` | 20 | `50ms` |

### Easing

| Token | Value | Usage |
|-------|-------|-------|
| `ease-drop` | `cubic-bezier(0.33, 1, 0.68, 1)` | Hard drop |
| `ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Lock animation |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Line clear |

---

## Z-Index

| Token | Value | Usage |
|-------|-------|-------|
| `z-background` | `0` | CRT effects layer |
| `z-grid` | `10` | Game board |
| `z-pieces` | `20` | Tetrominos |
| `z-ghost` | `15` | Ghost piece |
| `z-ui` | `30` | UI panels |
| `z-overlay` | `40` | Pause/Game over |
| `z-modal` | `50` | Modals |
| `z-effects` | `60` | Scanlines, effects |

---

## Responsive Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `screen-sm` | `480px` | Mobile |
| `screen-md` | `768px` | Tablet |
| `screen-lg` | `1024px` | Desktop |

### Responsive Cell Sizes

| Breakpoint | Cell Size | Board Width |
|------------|-----------|-------------|
| Mobile | `20px` | `200px` |
| Tablet | `24px` | `240px` |
| Desktop | `28px` | `280px` |

---

## Sound Design Tokens (Reference)

| Event | Description |
|-------|-------------|
| `sfx-move` | Short blip on piece move |
| `sfx-rotate` | Quick whoosh on rotation |
| `sfx-drop` | Thud on hard drop |
| `sfx-lock` | Click when piece locks |
| `sfx-clear-single` | Chime for 1 line |
| `sfx-clear-tetris` | Fanfare for 4 lines |
| `sfx-level-up` | Ascending arpeggio |
| `sfx-game-over` | Descending tones |
| `music-theme` | Korobeiniki-style loop |

---

## Implementation Notes

### CSS Custom Properties

```css
:root {
  /* Core game colors */
  --color-void: #0a0a0f;
  --color-grid-bg: #12121a;
  --cell-size: 28px;
  
  /* Piece colors */
  --piece-i: #00f5ff;
  --piece-o: #ffd700;
  --piece-t: #bf00ff;
  --piece-s: #00ff66;
  --piece-z: #ff3366;
  --piece-j: #3366ff;
  --piece-l: #ff9933;
}
```

### Tailwind Config Extension

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        void: '#0a0a0f',
        grid: { bg: '#12121a', line: '#1e1e2e' },
        piece: {
          i: '#00f5ff',
          o: '#ffd700',
          t: '#bf00ff',
          s: '#00ff66',
          z: '#ff3366',
          j: '#3366ff',
          l: '#ff9933',
        },
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
};
```
