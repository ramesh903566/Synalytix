# Synalytix Design System

This document outlines the UI/UX guidelines and design system for Synalytix.

## Tech Stack
*   **Styling**: Tailwind CSS v4.
*   **Base Styles**: `frontend/src/index.css` utilizes Tailwind v4 `@theme` directives for custom variables and scales.
*   **Icons**: Lucide React.
*   **Animations**: Framer Motion (`motion`).

## Core Principles
*   **High-End Visual Design**: Premium feel, intentional aesthetic, avoiding generic AI-generated looks.
*   **Dynamic and Interactive**: Micro-animations and hover states for a responsive experience.
*   **Consistent Platform Identity**: The unified dashboard must feel cohesive despite aggregating 5 distinct platforms.

## Components
*   Reusable components are located in `frontend/src/components/`.
*   Use `class-variance-authority` (cva), `clsx`, and `tailwind-merge` for robust, composable component styling.
*   *Note: Ensure compatibility with Tailwind v4 when writing utility classes and custom theme variables.*

## Design Tokens

*(To be expanded as `index.css` is built out)*
*   **Colors**: (Document primary, secondary, background, and platform-specific accent colors)
*   **Typography**: (Document font families, sizes, weights)
*   **Spacing**: Standardized gaps and margins.
*   **Animations**: Standardized transition timings and easing curves.
