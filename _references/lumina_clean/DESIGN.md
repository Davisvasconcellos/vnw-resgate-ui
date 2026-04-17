# Design System Document

## 1. Overview & Creative North Star
The visual identity of this design system is anchored by the Creative North Star: **"The Pristine Concierge."** 

This is not merely a utility for booking services; it is a premium digital environment that mirrors the feeling of a freshly cleaned, high-end space. We achieve this through "Soft Minimalism"—a departure from the rigid, boxy layouts of legacy service apps. By utilizing intentional asymmetry, expansive breathing room, and overlapping "glass" layers, the UI feels fluid and organic rather than mechanical. The goal is to move beyond the "template" look by treating every screen as an editorial composition where negative space is as important as the content itself.

## 2. Colors
Our palette is engineered to balance clinical trust with high-end hospitality.

*   **Primary Blue (#0058be):** The anchor of trust. Used for high-priority actions and brand signaling.
*   **Secondary Emerald (#006c49):** Symbolizes "Success" and "Sanitization." Used for completion states and confirmed bookings.
*   **Tertiary Amber (#825100):** Reserved for ratings and urgent alerts, providing a warm contrast to the cooler primary tones.

### The "No-Line" Rule
To maintain a premium, seamless aesthetic, **the use of 1px solid borders for sectioning is strictly prohibited.** Designers must define boundaries through background color shifts. For example, a `surface-container-low` card should sit on a `surface` background. The transition between these tonal values is the divider.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
*   **Base:** `surface` (#f7f9fb)
*   **Elevated Sections:** `surface-container-low` (#f2f4f6)
*   **Interactive Cards:** `surface-container-lowest` (#ffffff)
This nesting creates natural depth without the visual clutter of lines.

### The "Glass & Gradient" Rule
For floating menus and global headers, use **Glassmorphism**. Apply a backdrop-blur (20px-30px) to semi-transparent surface colors. To add "visual soul," apply subtle linear gradients to main CTAs (transitioning from `primary` to `primary_container`) to mimic the way light hits a polished surface.

## 3. Typography
We use a dual-font system to create an editorial feel that commands authority while remaining approachable.

*   **Display & Headlines (Plus Jakarta Sans):** A sophisticated sans-serif with a modern geometric touch. The large scale (`display-lg` at 3.5rem) should be used with tight letter-spacing to create a "Signature" look in hero sections.
*   **Body & Labels (Manrope):** Chosen for its exceptional legibility at small scales. Manrope’s open apertures ensure that service details and professional tools remain functional and clear.

The hierarchy is intentional: headlines are bold and assertive to convey efficiency, while body text is spaced generously to convey a sense of calm and "cleanliness."

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering** rather than traditional drop shadows.

*   **The Layering Principle:** Stack `surface-container` tiers to create lift. A white card (`surface-container-lowest`) on a light grey background (`surface-container-high`) provides a soft, structural "pop" that feels native to modern OS environments.
*   **Ambient Shadows:** Where a floating effect is mandatory (e.g., a primary "Book Now" button), use extra-diffused shadows. 
    *   *Blur:* 32px to 48px. 
    *   *Opacity:* 4% - 8%. 
    *   *Color:* Use a tinted version of `on-surface` (#191c1e) to mimic natural light.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a container edge, use the `outline-variant` token at **15% opacity**. This creates a "Ghost Border" that guides the eye without breaking the minimalist flow.
*   **Glassmorphism:** Use backdrop-blur on `surface_bright` with 70% opacity for navigation bars to allow the content colors to bleed through as the user scrolls, creating a sense of continuity.

## 5. Components

### Buttons
*   **Primary:** High corner radius (`rounded-xl` / 3rem). Uses a gradient from `primary` to `primary_container`. Text is `on_primary`.
*   **Secondary:** `surface-container-high` background with `on_surface` text. No border.
*   **Padding:** High horizontal padding (Scale 8 / 2.75rem) to create a "pill" look that feels premium.

### Cards & Lists
*   **Card Styling:** Use `rounded-lg` (2rem) or `rounded-md` (1.5rem). 
*   **The Divider Prohibition:** Never use a horizontal line to separate list items. Use vertical white space (Spacing Scale 4 or 5) or alternating tonal backgrounds (`surface-container-low` vs `surface-container-lowest`).

### Input Fields
*   **State:** Default state uses `surface-container-highest` with no border. On focus, transition to a "Ghost Border" using the `primary` color at 20% opacity.
*   **Corners:** Match the button radius (`rounded-md`).

### Signature Component: The "Service Sheet"
For the booking flow, use a large-radius bottom sheet that utilizes glassmorphism for the "Confirm" footer. The content within the sheet should overlap the background imagery, creating a high-end, layered editorial look.

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts (e.g., offsetting a headline to the left and a service icon to the right with generous gap).
*   **Do** prioritize white space. If a screen feels "full," increase the spacing scale values.
*   **Do** use high-quality, bright photography of clean environments to complement the `surface` colors.

### Don't
*   **Don't** use 1px solid black or dark grey borders.
*   **Don't** use "harsh" shadows. If the shadow is clearly visible at a glance, it is too dark.
*   **Don't** cram icons. Every icon should have a minimum touch target and significant "safe zone" padding (Spacing Scale 3).
*   **Don't** use default Material Design or Bootstrap-style grids. Break the grid intentionally for "Special Offers" or "Featured Professionals."