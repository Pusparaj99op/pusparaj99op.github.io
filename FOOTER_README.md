# Footer Animation Customization Guide

This guide explains how to customize the animated footer background effect (the "bouncy wave") in the Contact section.

## 1. Changing Colors (Theming)

The gradient colors are defined in `assets/css/premium.css` using CSS variables. You can find them in the `:root` (for Night Mode) and `[data-theme="day"]` (for Day Mode) sections.

To change the colors, simply edit the hex codes for these variables:

```css
/* Night Mode Colors (Default) */
:root {
    --footer-grad-start: #fec5fb; /* Top/Start Color */
    --footer-grad-end: #00bae2;   /* Bottom/End Color */
}

/* Day Mode Colors */
[data-theme="day"] {
    --footer-grad-start: #ff9a9e; /* Top/Start Color */
    --footer-grad-end: #fad0c4;   /* Bottom/End Color */
}
```

## 2. Adjusting Animation Speed/Feel

The animation logic is located in `assets/js/premium.js` inside the `initFooterAnimation()` function.

Look for this block:

```javascript
gsap.fromTo('#bouncy-path', {
    morphSVG: down
}, {
    duration: 2,  // Change this to make it faster (lower) or slower (higher)
    morphSVG: center,
    ease: `elastic.out(${1 + Math.abs(variation)}, 0.2)`, // Adjust elasticity here
    overwrite: 'true'
});
```

- **Duration**: Controls how long the bounce takes to settle.
- **Elasticity**: `1 + Math.abs(variation)` controls the bounciness based on scroll speed. The second number (`0.2`) is the period. Lower period = more wobbles.

## 3. Modifying the Shape

The SVG paths are defined as strings in the JS file:

```javascript
const down = 'M0-0.3C0-0.3...';   // The "stretched" shape when scrolling
const center = 'M0-0.3C0-0.3...'; // The "resting" shape
```

To change the shape, you would typically use an SVG editor (like Illustrator) to create two paths with the same number of points: one for the resting state and one for the stretched state. Update these string variables with the `d` attribute from your new SVG paths.

## 4. Layering and Positioning

The effect is positioned in `assets/css/premium.css` under `.contact-bg-effect`.

- It is set to `z-index: 0` to sit behind the contact form.
- The contact form has `backdrop-filter: blur(10px)` to ensure text is readable over the animation.
