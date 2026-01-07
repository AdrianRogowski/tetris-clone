# RoomCodeInput Component

**Status**: 📝 Stub (pending implementation)
**Source**: `src/components/RoomCodeInput.tsx` (planned)
**Created**: 2026-01-06

## Purpose

Input field for entering a 6-character room code to join a multiplayer game. Auto-advances between character boxes and validates input.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `value` | `string` | Yes | Current input value |
| `onChange` | `(value: string) => void` | Yes | Called on input change |
| `error` | `string` | No | Error message to display |
| `disabled` | `boolean` | No | Disable input |

## Visual Design

- 6 separate input boxes
- Each box holds 1 character
- Auto-uppercase
- Auto-advance to next box on input
- Backspace moves to previous box
- Paste support (fills all boxes)

## Validation

- Only alphanumeric characters (A-Z, 0-9)
- Auto-uppercase
- Ignore special characters

## States

- Empty: Placeholder boxes
- Partial: Some boxes filled
- Complete: All 6 filled
- Error: Red border, error message below
- Disabled: Greyed out, no interaction
