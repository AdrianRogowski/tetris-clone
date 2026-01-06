# MobileControls Component

**Status**: ✅ Implemented  
**Source**: `src/components/MobileControls.tsx`  
**Created**: 2026-01-06

## Purpose

Provides touch-based game controls for mobile devices. Displays a D-pad for movement, action buttons for rotate/hard drop, and top buttons for hold/pause. Also handles gesture detection on the game board area.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onLeft` | `() => void` | Yes | Called when left button pressed |
| `onRight` | `() => void` | Yes | Called when right button pressed |
| `onDown` | `() => void` | Yes | Called when down button pressed |
| `onRotate` | `() => void` | Yes | Called when rotate button pressed or board tapped |
| `onHardDrop` | `() => void` | Yes | Called when hard drop button pressed or swipe down |
| `onHold` | `() => void` | Yes | Called when hold button pressed |
| `onPause` | `() => void` | Yes | Called when pause button pressed |

## Behavior

### D-Pad Buttons (◀ ▼ ▶)
- **Tap**: Single action
- **Hold**: Auto-repeat after 170ms delay (DAS), then every 50ms

### Action Buttons
- **Rotate (↻)**: Single tap only, no repeat
- **Hard Drop (⬇)**: Single tap only, no repeat

### Top Buttons
- **HOLD**: Shows text label, triggers hold action
- **Pause (❚❚)**: Shows pause icon, toggles pause state

### Gesture Area (Swipe Zone)
- Covers the game board area above the bottom controls
- **Tap**: Triggers rotate
- **Swipe Down** (>30px, <300ms): Triggers hard drop

## Visual Design

### Button Styling
```css
/* Base button */
background: rgba(255, 255, 255, 0.08);
border: 2px solid rgba(255, 255, 255, 0.15);
border-radius: 12px;

/* Active state */
background: rgba(0, 245, 255, 0.2);
border-color: var(--color-accent-primary);
transform: scale(0.95);
```

### Button Sizes
| Button Type | Size |
|-------------|------|
| D-pad buttons | 56×56px (48px on small screens) |
| Action buttons | 72×72px (64px on small screens) |
| Top buttons | Auto width, 12px padding |

### Action Button Colors
- **Rotate**: Purple tint (`--piece-t`)
- **Hard Drop**: Red tint (`--piece-z`)

## Layout

```
┌────────────────────────────────────────────┐
│ [HOLD]                              [❚❚]  │  ← Top row (fixed position)
│                                            │
│         (Swipe/Tap gesture area)           │  ← Covers board
│                                            │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│  [◀] [▼] [▶]                  (↻)   (⬇)   │  ← Bottom controls
│                                            │
└────────────────────────────────────────────┘
```

## Responsive Breakpoints

| Viewport | Cell Size | Button Adjustments |
|----------|-----------|-------------------|
| ≥768px | 28px | Controls hidden (keyboard mode) |
| 481-767px | 18px | Standard touch controls |
| ≤480px | 15px | Smaller buttons (48px D-pad, 64px action) |

## Accessibility

- Touch targets meet 44px minimum for accessibility
- Visual feedback on press (scale + color change)
- No hover states (touch-only)

## Dependencies

- None (pure React component)

## Usage

```tsx
<MobileControls
  onLeft={handleLeft}
  onRight={handleRight}
  onDown={handleDown}
  onRotate={handleRotate}
  onHardDrop={handleHardDrop}
  onHold={handleHold}
  onPause={handlePause}
/>
```

## Related

- `useMobile.ts` - Hook that detects touch devices
- `Game.tsx` - Parent component that conditionally renders MobileControls
